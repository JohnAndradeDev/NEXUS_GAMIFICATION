import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { Prisma } from "../../../generated/prisma/client.js";
import type {
  AssignmentStatus,
  Role,
  TaskDifficulty,
  TaskStatus,
} from "../../../generated/prisma/enums.js";
import { AppError } from "../../lib/errors.js";
import { levelProgress } from "../../lib/leveling.js";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";
import { unlockEligibleAchievements } from "../achievements/achievements.service.js";
import { notify, notifySafe } from "../notifications/notifications.service.js";
import { applyPoints } from "../points/points.service.js";

const POINTS_BY_DIFFICULTY: Record<TaskDifficulty, number> = {
  FACIL: 5,
  MEDIO: 10,
  DIFICIL: 15,
};

const idParams = z.object({ id: z.coerce.number().int().positive() });

const listQuery = paginationSchema.extend({
  status: z.enum(["PENDENTE", "EM_ANDAMENTO", "CONCLUIDA", "ATRASADA", "CANCELADA"]).optional(),
  difficulty: z.enum(["FACIL", "MEDIO", "DIFICIL"]).optional(),
  dueFrom: z.coerce.date().optional(),
  dueTo: z.coerce.date().optional(),
  squadId: z.coerce.number().int().optional(),
  search: z.string().trim().optional(),
  overdue: z.enum(["true"]).optional(),
});

const createBody = z
  .object({
    title: z.string().trim().min(3),
    description: z.string().trim().optional(),
    category: z.string().trim().optional(),
    difficulty: z.enum(["FACIL", "MEDIO", "DIFICIL"]),
    priority: z.number().int().min(1).max(3).default(2), // 1 baixa, 2 média, 3 alta
    startDate: z.coerce.date().optional(),
    dueDate: z.coerce.date(),
    squadId: z.number().int().optional(), // só o admin precisa informar
    assigneeIds: z.array(z.number().int()).min(1),
  })
  .refine((data) => !data.startDate || data.dueDate >= data.startDate, {
    message: "A data final não pode ser anterior à data inicial",
    path: ["dueDate"],
  });

const updateBody = z
  .object({
    title: z.string().trim().min(3),
    description: z.string().trim().nullable(),
    category: z.string().trim().nullable(),
    difficulty: z.enum(["FACIL", "MEDIO", "DIFICIL"]),
    priority: z.number().int().min(1).max(3), // 1 baixa, 2 média, 3 alta
    startDate: z.coerce.date().nullable(),
    dueDate: z.coerce.date(),
  })
  .partial();

const assigneesBody = z.object({
  userIds: z.array(z.number().int().positive()).min(1),
});

const statusBody = z.object({
  status: z.enum(["EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"]),
});

async function getManagerSquadId(userId: number) {
  const manager = await prisma.user.findUnique({
    where: { id: userId },
    select: { squadId: true },
  });
  return manager?.squadId ?? null;
}

const formatDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });

// Gestor só mexe em tarefas do próprio squad; o admin mexe em qualquer uma
async function assertCanManageTask(me: { sub: number; role: Role }, squadId: number) {
  if (me.role === "ADMIN") return;
  if ((await getManagerSquadId(me.sub)) !== squadId) {
    throw new AppError(403, "Você só pode gerenciar tarefas do seu squad");
  }
}

// Tarefa atrasada é calculada na hora, não gravada no banco
function isOverdue(
  task: { dueDate: Date; status: TaskStatus; assignments: { status: AssignmentStatus }[] },
  viewerIsUser: boolean,
) {
  if (task.dueDate.getTime() >= Date.now() || task.status === "CANCELADA") return false;

  if (viewerIsUser) {
    const mine = task.assignments[0];
    return !!mine && mine.status !== "CONCLUIDA";
  }
  return task.status === "PENDENTE" || task.status === "EM_ANDAMENTO";
}

export const tasksRoutes: FastifyPluginAsync = async (app) => {
  // USER vê as próprias tarefas; GESTOR, as do seu squad; ADMIN, todas
  app.get("/", { preHandler: app.authenticate }, async (req) => {
    const { page, perPage, status, difficulty, dueFrom, dueTo, squadId, search, overdue } =
      listQuery.parse(req.query);
    const me = req.user;
    const viewerIsUser = me.role === "USER";

    let scope: Prisma.TaskWhereInput = {};
    if (viewerIsUser) {
      scope = { assignments: { some: { userId: me.sub } } };
    } else if (me.role === "GESTOR") {
      const managerSquadId = await getManagerSquadId(me.sub);
      if (!managerSquadId) return { items: [], meta: paginationMeta(page, perPage, 0) };
      scope = { squadId: managerSquadId };
    } else if (squadId) {
      scope = { squadId };
    }

    const where: Prisma.TaskWhereInput = {
      ...scope,
      ...(status && { status }),
      ...(difficulty && { difficulty }),
      ...((dueFrom || dueTo) && {
        dueDate: { ...(dueFrom && { gte: dueFrom }), ...(dueTo && { lte: dueTo }) },
      }),
      ...(search && { title: { contains: search, mode: "insensitive" } }),
      // atrasada = prazo vencido e ainda aberta (o status não é gravado como ATRASADA)
      ...(overdue && {
        AND: [
          { dueDate: { lt: new Date() } },
          { status: { in: ["PENDENTE", "EM_ANDAMENTO"] } },
        ],
      }),
    };

    const [tasks, total] = await prisma.$transaction([
      prisma.task.findMany({
        where,
        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          priority: true,
          difficulty: true,
          basePoints: true,
          status: true,
          startDate: true,
          dueDate: true,
          completedAt: true,
          squadId: true,
          squad: { select: { id: true, name: true } },
          assignments: {
            where: viewerIsUser ? { userId: me.sub } : undefined,
            select: {
              id: true,
              userId: true,
              status: true,
              progress: true,
              pointsAwarded: true,
              completedAt: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: [{ dueDate: "asc" }, { id: "asc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.task.count({ where }),
    ]);

    const items = tasks.map((task) => ({
      ...task,
      isOverdue: isOverdue(task, viewerIsUser),
    }));

    return { items, meta: paginationMeta(page, perPage, total) };
  });

  app.post("/", { preHandler: app.authorize("GESTOR", "ADMIN") }, async (req, reply) => {
    const body = createBody.parse(req.body);
    const me = req.user;

    let squadId: number;
    if (me.role === "GESTOR") {
      const managerSquadId = await getManagerSquadId(me.sub);
      if (!managerSquadId) throw new AppError(403, "O gestor precisa estar associado a um squad");
      if (body.squadId && body.squadId !== managerSquadId) {
        throw new AppError(403, "Você só pode criar tarefas para o seu próprio squad");
      }
      squadId = managerSquadId;
    } else {
      if (!body.squadId) throw new AppError(400, "Informe o squad da tarefa");
      squadId = body.squadId;
    }

    const squad = await prisma.squad.findUnique({
      where: { id: squadId },
      select: { isActive: true },
    });
    if (!squad) throw new AppError(404, "Squad não encontrado");
    if (!squad.isActive) throw new AppError(409, "Um squad desativado não pode receber tarefas");

    if (body.dueDate.getTime() <= Date.now()) {
      throw new AppError(400, "O prazo da tarefa deve estar no futuro");
    }

    const assigneeIds = [...new Set(body.assigneeIds)];
    const members = await prisma.user.findMany({
      where: { id: { in: assigneeIds }, squadId, status: "ACTIVE" },
      select: { id: true },
    });
    if (members.length !== assigneeIds.length) {
      throw new AppError(400, "Todos os responsáveis devem ser membros ativos do squad");
    }

    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        difficulty: body.difficulty,
        priority: body.priority,
        basePoints: POINTS_BY_DIFFICULTY[body.difficulty],
        startDate: body.startDate,
        dueDate: body.dueDate,
        squadId,
        createdById: me.sub,
        assignments: { create: assigneeIds.map((userId) => ({ userId })) },
      },
      select: { id: true, title: true, difficulty: true, basePoints: true, dueDate: true },
    });

    // avisa os responsáveis (menos o próprio gestor, se ele se incluiu)
    await notifySafe(
      assigneeIds.filter((userId) => userId !== me.sub),
      {
        type: "TASK_ASSIGNED",
        title: "Nova tarefa atribuída",
        message: `"${task.title}" • +${task.basePoints} pts • prazo ${formatDate(task.dueDate)}`,
        link: "/",
      },
    );

    return reply.status(201).send({ task });
  });

  app.patch("/:id/status", { preHandler: app.authenticate }, async (req) => {
    const { id } = idParams.parse(req.params);
    const { status } = statusBody.parse(req.body);
    const me = req.user;

    // ---- cancelar: gestor do squad ou admin ----
    if (status === "CANCELADA") {
      if (me.role === "USER") throw new AppError(403, "Sem permissão para cancelar tarefas");

      const task = await prisma.task.findUnique({
        where: { id },
        select: { squadId: true, status: true },
      });
      if (!task) throw new AppError(404, "Tarefa não encontrada");

      if (me.role === "GESTOR" && (await getManagerSquadId(me.sub)) !== task.squadId) {
        throw new AppError(403, "Você só pode cancelar tarefas do seu squad");
      }
      if (task.status === "CONCLUIDA") {
        throw new AppError(409, "Uma tarefa concluída não pode ser cancelada");
      }

      await prisma.task.update({ where: { id }, data: { status: "CANCELADA" } });

      // quem ainda não tinha concluído é avisado
      const [info, open] = await Promise.all([
        prisma.task.findUnique({ where: { id }, select: { title: true } }),
        prisma.taskAssignment.findMany({
          where: { taskId: id, status: { not: "CONCLUIDA" } },
          select: { userId: true },
        }),
      ]);
      await notifySafe(
        open.map((item) => item.userId).filter((userId) => userId !== me.sub),
        {
          type: "TASK_CANCELED",
          title: "Tarefa cancelada",
          message: `"${info?.title ?? "A tarefa"}" foi cancelada pelo gestor.`,
          link: "/",
        },
      );

      return { reward: null };
    }

    // ---- iniciar ou concluir: age sobre a atribuição de quem está logado ----
    const task = await prisma.task.findUnique({
      where: { id },
      select: { id: true, title: true, status: true, basePoints: true, createdById: true },
    });
    if (!task) throw new AppError(404, "Tarefa não encontrada");
    if (task.status === "CANCELADA") throw new AppError(409, "Esta tarefa foi cancelada");

    const now = new Date();

    if (status === "EM_ANDAMENTO") {
      const started = await prisma.taskAssignment.updateMany({
        where: { taskId: id, userId: me.sub, status: "PENDENTE" },
        data: { status: "EM_ANDAMENTO", startedAt: now },
      });

      if (started.count === 0) {
        const mine = await prisma.taskAssignment.findUnique({
          where: { taskId_userId: { taskId: id, userId: me.sub } },
          select: { id: true },
        });
        if (!mine) throw new AppError(403, "Esta tarefa não foi atribuída a você");
        throw new AppError(409, "A tarefa já foi iniciada ou concluída");
      }

      if (task.status === "PENDENTE") {
        await prisma.task.update({ where: { id }, data: { status: "EM_ANDAMENTO" } });
      }
      return { reward: null };
    }

    // CONCLUIDA: marca a atribuição, gera os pontos e atualiza o nível, tudo na mesma transação
    const reward = await prisma.$transaction(async (tx) => {
      // o filtro "status diferente de CONCLUIDA" garante que os pontos saiam uma única vez
      const done = await tx.taskAssignment.updateMany({
        where: { taskId: id, userId: me.sub, status: { not: "CONCLUIDA" } },
        data: {
          status: "CONCLUIDA",
          progress: 100,
          completedAt: now,
          pointsAwarded: task.basePoints,
        },
      });

      if (done.count === 0) {
        const mine = await tx.taskAssignment.findUnique({
          where: { taskId_userId: { taskId: id, userId: me.sub } },
          select: { id: true },
        });
        if (!mine) throw new AppError(403, "Esta tarefa não foi atribuída a você");
        throw new AppError(409, "Você já concluiu esta tarefa");
      }

      const result = await applyPoints(tx, {
        userId: me.sub,
        amount: task.basePoints,
        type: "TASK_COMPLETED",
        description: `Tarefa concluída: ${task.title}`,
        taskId: id,
      });

      const pending = await tx.taskAssignment.count({
        where: { taskId: id, status: { not: "CONCLUIDA" } },
      });
      if (pending === 0) {
        await tx.task.update({ where: { id }, data: { status: "CONCLUIDA", completedAt: now } });
      } else if (task.status === "PENDENTE") {
        await tx.task.update({ where: { id }, data: { status: "EM_ANDAMENTO" } });
      }

      // concluir uma tarefa pode cumprir conquistas (missões, pontos, sequência, ranking, equipe)
      const achievements = await unlockEligibleAchievements(tx, me.sub);

      // o bônus das conquistas também soma XP, então o resultado usa o valor final
      const final = await tx.user.findUniqueOrThrow({
        where: { id: me.sub },
        select: { experience: true, level: true },
      });

      // o gestor que criou a tarefa fica sabendo da conclusão
      if (task.createdById !== me.sub) {
        const actor = await tx.user.findUniqueOrThrow({
          where: { id: me.sub },
          select: { name: true },
        });
        await notify(tx, task.createdById, {
          type: "TASK_COMPLETED",
          title: "Tarefa concluída",
          message: `${actor.name} concluiu "${task.title}"`,
          link: "/",
        });
      }

      return {
        pointsAwarded: task.basePoints,
        experience: final.experience,
        leveledUp: final.level > result.previousLevel,
        achievements,
        ...levelProgress(final.experience),
      };
    });

    return { reward };
  });

  // ---- editar tarefa (gestor do squad ou admin) ----
  app.patch("/:id", { preHandler: app.authorize("GESTOR", "ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const body = updateBody.parse(req.body);

    const task = await prisma.task.findUnique({
      where: { id },
      select: {
        squadId: true,
        status: true,
        startDate: true,
        dueDate: true,
        difficulty: true,
        assignments: { select: { status: true, userId: true } },
      },
    });
    if (!task) throw new AppError(404, "Tarefa não encontrada");
    await assertCanManageTask(req.user, task.squadId);

    if (task.status === "CANCELADA") {
      throw new AppError(409, "Tarefas canceladas não podem ser editadas");
    }
    if (task.status === "CONCLUIDA") {
      throw new AppError(409, "Tarefas concluídas não podem ser editadas");
    }

    const nextStart = body.startDate === undefined ? task.startDate : body.startDate;
    const nextDue = body.dueDate ?? task.dueDate;
    if (nextStart && nextDue < nextStart) {
      throw new AppError(400, "A data final não pode ser anterior à data inicial");
    }

    // o prazo só precisa estar no futuro quando ele muda (editar o título de uma tarefa atrasada é permitido)
    if (
      body.dueDate &&
      body.dueDate.getTime() !== task.dueDate.getTime() &&
      body.dueDate.getTime() <= Date.now()
    ) {
      throw new AppError(400, "O novo prazo deve estar no futuro");
    }

    let basePoints: number | undefined;
    if (body.difficulty && body.difficulty !== task.difficulty) {
      if (task.assignments.some((a) => a.status === "CONCLUIDA")) {
        throw new AppError(409, "A dificuldade não pode mudar depois que alguém concluiu a tarefa");
      }
      basePoints = POINTS_BY_DIFFICULTY[body.difficulty];
    }

    const updated = await prisma.task.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.startDate !== undefined && { startDate: body.startDate }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate }),
        ...(body.difficulty !== undefined && { difficulty: body.difficulty }),
        ...(basePoints !== undefined && { basePoints }),
      },
      select: { id: true, title: true, difficulty: true, basePoints: true, dueDate: true },
    });

    // avisa quem ainda tem a tarefa em aberto sobre o que mudou
    const changes: string[] = [];
    if (body.title !== undefined) changes.push("título alterado");
    if (body.dueDate && body.dueDate.getTime() !== task.dueDate.getTime()) {
      changes.push(`novo prazo ${formatDate(body.dueDate)}`);
    }
    if (basePoints !== undefined) changes.push(`recompensa de +${basePoints} pts`);
    if (
      body.description !== undefined ||
      body.category !== undefined ||
      body.priority !== undefined ||
      body.startDate !== undefined
    ) {
      changes.push("detalhes atualizados");
    }

    if (changes.length > 0) {
      await notifySafe(
        task.assignments
          .filter((a) => a.status !== "CONCLUIDA" && a.userId !== req.user.sub)
          .map((a) => a.userId),
        {
          type: "TASK_UPDATED",
          title: "Tarefa atualizada",
          message: `"${updated.title}": ${changes.join(", ")}.`,
          link: "/",
        },
      );
    }

    return { task: updated };
  });

  // ---- atribuir mais responsáveis ----
  app.post(
    "/:id/assignments",
    { preHandler: app.authorize("GESTOR", "ADMIN") },
    async (req, reply) => {
      const { id } = idParams.parse(req.params);
      const { userIds } = assigneesBody.parse(req.body);

      const task = await prisma.task.findUnique({
        where: { id },
        select: { squadId: true, status: true, title: true },
      });
      if (!task) throw new AppError(404, "Tarefa não encontrada");
      await assertCanManageTask(req.user, task.squadId);

      if (task.status === "CANCELADA") {
        throw new AppError(409, "Uma tarefa cancelada não pode receber novos responsáveis");
      }
      if (task.status === "CONCLUIDA") {
        throw new AppError(409, "Uma tarefa concluída não recebe novos responsáveis");
      }

      const ids = [...new Set(userIds)];

      const members = await prisma.user.findMany({
        where: { id: { in: ids }, squadId: task.squadId, status: "ACTIVE" },
        select: { id: true },
      });
      if (members.length !== ids.length) {
        throw new AppError(400, "Todos os responsáveis devem ser membros ativos do squad");
      }

      const already = await prisma.taskAssignment.count({
        where: { taskId: id, userId: { in: ids } },
      });
      if (already > 0) {
        throw new AppError(409, "Algum dos usuários já é responsável por esta tarefa");
      }

      await prisma.taskAssignment.createMany({
        data: ids.map((userId) => ({ taskId: id, userId })),
      });

      await notifySafe(
        ids.filter((userId) => userId !== req.user.sub),
        {
          type: "TASK_ASSIGNED",
          title: "Você foi adicionado a uma tarefa",
          message: `"${task.title}"`,
          link: "/",
        },
      );

      return reply.status(201).send({ added: ids.length });
    },
  );

  // ---- remover um responsável ----
  app.delete(
    "/:id/assignments/:userId",
    { preHandler: app.authorize("GESTOR", "ADMIN") },
    async (req, reply) => {
      const { id, userId } = idParams
        .extend({ userId: z.coerce.number().int().positive() })
        .parse(req.params);

      const task = await prisma.task.findUnique({
        where: { id },
        select: { squadId: true, status: true, title: true },
      });
      if (!task) throw new AppError(404, "Tarefa não encontrada");
      await assertCanManageTask(req.user, task.squadId);

      if (task.status === "CANCELADA" || task.status === "CONCLUIDA") {
        throw new AppError(409, "Só é possível remover responsáveis de tarefas em aberto");
      }

      await prisma.$transaction(async (tx) => {
        const assignment = await tx.taskAssignment.findUnique({
          where: { taskId_userId: { taskId: id, userId } },
          select: { id: true, status: true },
        });
        if (!assignment) throw new AppError(404, "Este usuário não é responsável pela tarefa");

        if (assignment.status === "CONCLUIDA") {
          throw new AppError(
            409,
            "Quem já concluiu a tarefa não pode ser removido: os pontos ficam no histórico",
          );
        }

        const total = await tx.taskAssignment.count({ where: { taskId: id } });
        if (total <= 1) {
          throw new AppError(
            409,
            "A tarefa precisa de ao menos um responsável. Para encerrá-la, cancele a tarefa.",
          );
        }

        await tx.taskAssignment.delete({ where: { id: assignment.id } });

        // se só sobraram responsáveis que já concluíram, a tarefa está concluída
        const remaining = await tx.taskAssignment.findMany({
          where: { taskId: id },
          select: { status: true },
        });
        if (remaining.every((a) => a.status === "CONCLUIDA")) {
          await tx.task.update({
            where: { id },
            data: { status: "CONCLUIDA", completedAt: new Date() },
          });
        }
      });

      if (userId !== req.user.sub) {
        await notifySafe(userId, {
          type: "TASK_REMOVED",
          title: "Você saiu de uma tarefa",
          message: `Você não é mais responsável por "${task.title}".`,
          link: "/",
        });
      }

      return reply.status(204).send();
    },
  );
};
