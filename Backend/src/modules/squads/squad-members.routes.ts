import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { Role } from "../../../generated/prisma/enums.js";
import { AppError } from "../../lib/errors.js";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";
import { notifySafe } from "../notifications/notifications.service.js";

const idParams = z.object({ id: z.coerce.number().int().positive() });
const memberParams = idParams.extend({ userId: z.coerce.number().int().positive() });

const percent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 1000) / 10;

// Um gestor só administra o squad ao qual está associado; o admin administra qualquer um
async function assertCanManage(me: { sub: number; role: Role }, squadId: number) {
  if (me.role === "ADMIN") return;

  const mine = await prisma.user.findUnique({
    where: { id: me.sub },
    select: { squadId: true },
  });
  if (mine?.squadId !== squadId) {
    throw new AppError(403, "Você só pode gerenciar o seu próprio squad");
  }
}

export const squadMembersRoutes: FastifyPluginAsync = async (app) => {
  // ---- escalação do squad, com dados de desempenho de cada membro ----
  app.get("/:id/members", { preHandler: app.authorize("GESTOR", "ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    await assertCanManage(req.user, id);

    const squad = await prisma.squad.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        managerId: true,
        members: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            name: true,
            email: true,
            jobTitle: true,
            sector: true,
            level: true,
            role: true,
          },
        },
      },
    });
    if (!squad) throw new AppError(404, "Squad não encontrado");

    const memberIds = squad.members.map((member) => member.id);

    const [pointRows, assignments] = await Promise.all([
      prisma.pointTransaction.groupBy({
        by: ["userId"],
        where: { userId: { in: memberIds } },
        _sum: { amount: true },
      }),
      prisma.taskAssignment.findMany({
        where: {
          userId: { in: memberIds },
          task: { squadId: id, status: { not: "CANCELADA" } },
        },
        select: {
          userId: true,
          status: true,
          completedAt: true,
          task: { select: { id: true, title: true, dueDate: true } },
        },
        orderBy: { task: { dueDate: "asc" } },
      }),
    ]);

    const pointsOf = new Map(pointRows.map((row) => [row.userId, row._sum.amount ?? 0]));

    const unlockedRows = await prisma.userAchievement.findMany({
      where: { userId: { in: memberIds } },
      select: {
        userId: true,
        achievement: { select: { id: true, name: true, description: true, icon: true } },
      },
      orderBy: { unlockedAt: "desc" },
    });
    const achievementsOf = new Map<
      number,
      { id: number; name: string; description: string; icon: string | null }[]
    >();
    for (const row of unlockedRows) {
      const list = achievementsOf.get(row.userId) ?? [];
      list.push(row.achievement);
      achievementsOf.set(row.userId, list);
    }
    const assignmentsOf = new Map<number, typeof assignments>();
    for (const assignment of assignments) {
      const list = assignmentsOf.get(assignment.userId) ?? [];
      list.push(assignment);
      assignmentsOf.set(assignment.userId, list);
    }

    const totalPoints = squad.members.reduce(
      (sum, member) => sum + (pointsOf.get(member.id) ?? 0),
      0,
    );

    let deliveries = 0;
    let deliveredOnTime = 0;

    const members = squad.members
      .map((member) => {
        const list = assignmentsOf.get(member.id) ?? [];
        const done = list.filter((a) => a.status === "CONCLUIDA");
        const pending = list.filter((a) => a.status !== "CONCLUIDA");
        const onTime = done.filter((a) => a.completedAt && a.completedAt <= a.task.dueDate).length;
        const points = pointsOf.get(member.id) ?? 0;

        deliveries += done.length;
        deliveredOnTime += onTime;

        return {
          ...member,
          isManager: squad.managerId === member.id,
          points,
          share: percent(points, totalPoints),
          tasksCompleted: done.length,
          tasksPending: pending.length,
          progress: percent(done.length, list.length),
          onTimeRate: percent(onTime, done.length),
          achievements: achievementsOf.get(member.id) ?? [],
          queue: pending.map((a) => ({
            taskId: a.task.id,
            title: a.task.title,
            status: a.status,
            dueDate: a.task.dueDate,
          })),
        };
      })
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
      .map((member, index) => ({ ...member, position: index + 1 }));

    return {
      squad: {
        id: squad.id,
        name: squad.name,
        description: squad.description,
        isActive: squad.isActive,
        managerId: squad.managerId,
      },
      stats: {
        memberCount: members.length,
        totalPoints,
        averagePoints: members.length === 0 ? 0 : Math.round(totalPoints / members.length),
        onTimeRate: percent(deliveredOnTime, deliveries),
      },
      members,
    };
  });

  // ---- colaboradores que ainda podem ser adicionados (sem squad) ----
  app.get("/:id/candidates", { preHandler: app.authorize("GESTOR", "ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const { page, perPage, search } = paginationSchema
      .extend({ search: z.string().trim().optional() })
      .parse(req.query);
    await assertCanManage(req.user, id);

    const where = {
      status: "ACTIVE" as const,
      role: "USER" as const,
      squadId: null,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { jobTitle: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: { id: true, name: true, email: true, jobTitle: true, sector: true, level: true },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, meta: paginationMeta(page, perPage, total) };
  });

  // ---- adicionar membro ----
  app.post("/:id/members", { preHandler: app.authorize("GESTOR", "ADMIN") }, async (req, reply) => {
    const { id } = idParams.parse(req.params);
    const { userId } = z.object({ userId: z.number().int().positive() }).parse(req.body);
    await assertCanManage(req.user, id);

    const squad = await prisma.squad.findUnique({
      where: { id },
      select: { isActive: true, name: true },
    });
    if (!squad) throw new AppError(404, "Squad não encontrado");
    if (!squad.isActive) throw new AppError(409, "Um squad desativado não pode receber membros");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, status: true, role: true, squadId: true },
    });
    if (!user) throw new AppError(404, "Usuário não encontrado");
    if (user.status !== "ACTIVE") throw new AppError(409, "Este usuário está desativado");
    if (user.role !== "USER") {
      throw new AppError(400, "Só é possível adicionar colaboradores com perfil de usuário comum");
    }
    if (user.squadId === id) throw new AppError(409, "Este usuário já faz parte do squad");
    if (user.squadId !== null) throw new AppError(409, "Este usuário já pertence a outro squad");

    // o filtro "squadId: null" evita que dois gestores adicionem a mesma pessoa ao mesmo tempo
    const added = await prisma.user.updateMany({
      where: { id: userId, squadId: null, status: "ACTIVE" },
      data: { squadId: id },
    });
    if (added.count === 0) throw new AppError(409, "Este usuário acabou de entrar em outro squad");

    await notifySafe(user.id, {
      type: "SQUAD",
      title: "Você entrou em um squad",
      message: `Você agora faz parte do squad ${squad.name}.`,
      link: "/squad",
    });

    return reply.status(201).send({ member: { id: user.id, name: user.name } });
  });

  // ---- remover membro ----
  app.delete("/:id/members/:userId", { preHandler: app.authorize("GESTOR", "ADMIN") }, async (req, reply) => {
    const { id, userId } = memberParams.parse(req.params);
    const me = req.user;
    await assertCanManage(me, id);

    const member = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, squadId: true },
    });
    if (!member || member.squadId !== id) {
      throw new AppError(404, "Este usuário não faz parte do squad");
    }
    if (me.role === "GESTOR" && userId === me.sub) {
      throw new AppError(403, "O gestor não pode se remover do squad sem confirmação do administrador");
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: userId }, data: { squadId: null } });
      await tx.squad.updateMany({ where: { id, managerId: userId }, data: { managerId: null } });

      // tarefas não concluídas dele neste squad deixam de ser dele; o histórico de pontos fica
      const open = await tx.taskAssignment.findMany({
        where: { userId, status: { not: "CONCLUIDA" }, task: { squadId: id } },
        select: { id: true, taskId: true },
      });
      if (open.length === 0) return;

      await tx.taskAssignment.deleteMany({ where: { id: { in: open.map((a) => a.id) } } });

      for (const taskId of new Set(open.map((a) => a.taskId))) {
        const remaining = await tx.taskAssignment.findMany({
          where: { taskId },
          select: { status: true },
        });

        if (remaining.length === 0) {
          // ninguém sobrou para executar a tarefa
          await tx.task.updateMany({
            where: { id: taskId, status: { in: ["PENDENTE", "EM_ANDAMENTO"] } },
            data: { status: "CANCELADA" },
          });
        } else if (remaining.every((a) => a.status === "CONCLUIDA")) {
          await tx.task.updateMany({
            where: { id: taskId, status: { in: ["PENDENTE", "EM_ANDAMENTO"] } },
            data: { status: "CONCLUIDA", completedAt: new Date() },
          });
        }
      }
    });

    const leftSquad = await prisma.squad.findUnique({ where: { id }, select: { name: true } });
    await notifySafe(userId, {
      type: "SQUAD",
      title: "Você saiu de um squad",
      message: leftSquad
        ? `Você foi removido do squad ${leftSquad.name}. As tarefas em aberto dele foram desvinculadas.`
        : "Você foi removido do squad. As tarefas em aberto dele foram desvinculadas.",
      link: "/",
    });

    return reply.status(204).send();
  });
};
