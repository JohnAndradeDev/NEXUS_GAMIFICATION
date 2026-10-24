import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { squadMembersRoutes } from "./squad-members.routes.js";
import { squadsAdminRoutes } from "./squads-admin.routes.js";
import { getSquadStandings } from "./squads.service.js";

const idParams = z.object({ id: z.coerce.number().int().positive() });

const DAY_MS = 24 * 60 * 60 * 1000;
const percent = (part: number, total: number) =>
  total === 0 ? 0 : Math.round((part / total) * 1000) / 10;

export const squadsRoutes: FastifyPluginAsync = async (app) => {
  // gerenciamento de membros (gestor e admin): /api/squads/:id/members
  await app.register(squadMembersRoutes);
  // administração de squads (somente admin): criar, editar, definir gestor, desativar
  await app.register(squadsAdminRoutes);

  // Listagem mínima, usada pelos selects do painel admin.
  // O CRUD completo, com paginação, entra no módulo de Squads.
  app.get("/", { preHandler: app.authorize("ADMIN", "GESTOR") }, async () => {
    const items = await prisma.squad.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    return { items };
  });

  // Painel do squad (usuário e gestor) e base do dashboard do gestor.
  // O admin vê qualquer squad; os demais, apenas o próprio.
  app.get("/:id/overview", { preHandler: app.authenticate }, async (req) => {
    const { id } = idParams.parse(req.params);
    const me = req.user;

    if (me.role !== "ADMIN") {
      const mine = await prisma.user.findUnique({
        where: { id: me.sub },
        select: { squadId: true },
      });
      if (mine?.squadId !== id) {
        throw new AppError(403, "Você só pode ver o seu próprio squad");
      }
    }

    const squad = await prisma.squad.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        color: true,
        manager: { select: { id: true, name: true } },
        members: {
          where: { status: "ACTIVE" },
          select: {
            id: true,
            name: true,
            jobTitle: true,
            avatarUrl: true,
            level: true,
            role: true,
            lastLoginAt: true,
          },
        },
      },
    });
    if (!squad) throw new AppError(404, "Squad não encontrado");

    const now = Date.now();
    const weekAgo = new Date(now - 7 * DAY_MS);
    const memberIds = squad.members.map((member) => member.id);

    const [totalsByUser, weekByUser, recentPoints, tasks, activity, standings] =
      await Promise.all([
        prisma.pointTransaction.groupBy({
          by: ["userId"],
          where: { userId: { in: memberIds } },
          _sum: { amount: true },
        }),
        prisma.pointTransaction.groupBy({
          by: ["userId"],
          where: { userId: { in: memberIds }, createdAt: { gte: weekAgo } },
          _sum: { amount: true },
        }),
        prisma.pointTransaction.findMany({
          where: { userId: { in: memberIds }, createdAt: { gte: weekAgo } },
          select: { amount: true, createdAt: true },
        }),
        prisma.task.findMany({
          where: { squadId: id, status: { not: "CANCELADA" } },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            difficulty: true,
            basePoints: true,
            status: true,
            dueDate: true,
            completedAt: true,
            assignments: {
              select: {
                status: true,
                completedAt: true,
                user: { select: { id: true, name: true } },
              },
            },
          },
          orderBy: [{ dueDate: "asc" }, { id: "asc" }],
        }),
        prisma.pointTransaction.findMany({
          where: { userId: { in: memberIds } },
          select: {
            id: true,
            amount: true,
            type: true,
            description: true,
            createdAt: true,
            user: { select: { id: true, name: true } },
            task: { select: { id: true, title: true } },
          },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          take: 8,
        }),
        getSquadStandings(),
      ]);

    // ---- integrantes ----
    const totalOf = new Map(totalsByUser.map((row) => [row.userId, row._sum.amount ?? 0]));
    const weekOf = new Map(weekByUser.map((row) => [row.userId, row._sum.amount ?? 0]));

    const members = squad.members
      .map((member) => ({
        ...member,
        isManager: squad.manager?.id === member.id,
        points: totalOf.get(member.id) ?? 0,
        weekPoints: weekOf.get(member.id) ?? 0,
      }))
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

    const totalPoints = members.reduce((sum, member) => sum + member.points, 0);
    const weekPoints = members.reduce((sum, member) => sum + member.weekPoints, 0);

    // pontos por dia nas últimas 7 janelas de 24h (índice 6 = últimas 24h)
    const pointsByDay = Array.from({ length: 7 }, () => 0);
    for (const entry of recentPoints) {
      const daysAgo = Math.floor((now - entry.createdAt.getTime()) / DAY_MS);
      const index = 6 - Math.min(6, Math.max(0, daysAgo));
      pointsByDay[index] = (pointsByDay[index] ?? 0) + entry.amount;
    }

    // ---- tarefas do squad ----
    const open = tasks.filter((t) => t.status === "PENDENTE" || t.status === "EM_ANDAMENTO");
    const completed = tasks.filter((t) => t.status === "CONCLUIDA");

    let deliveries = 0;
    let onTime = 0;
    for (const task of tasks) {
      for (const assignment of task.assignments) {
        if (assignment.status !== "CONCLUIDA" || !assignment.completedAt) continue;
        deliveries += 1;
        if (assignment.completedAt <= task.dueDate) onTime += 1;
      }
    }

    const toMission = (task: (typeof tasks)[number]) => {
      const done = task.assignments.filter((a) => a.status === "CONCLUIDA").length;
      return {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        difficulty: task.difficulty,
        basePoints: task.basePoints,
        status: task.status,
        dueDate: task.dueDate,
        completedAt: task.completedAt,
        isOverdue: task.status !== "CONCLUIDA" && task.dueDate.getTime() < now,
        progress:
          task.assignments.length === 0
            ? 0
            : Math.round((done / task.assignments.length) * 100),
        assignees: task.assignments.map((a) => a.user),
      };
    };

    const missions = [
      ...open.map(toMission), // já vem ordenado pelo prazo
      ...[...completed]
        .sort((a, b) => (b.completedAt?.getTime() ?? 0) - (a.completedAt?.getTime() ?? 0))
        .slice(0, 2)
        .map(toMission),
    ].slice(0, 6);

    // ---- posição no ranking de squads ----
    const mine = standings.find((standing) => standing.id === id);

    // insígnias do squad: o que os membros já desbloquearam, com quantos têm cada uma
    const unlockedRows = await prisma.userAchievement.findMany({
      where: { userId: { in: memberIds } },
      select: {
        unlockedAt: true,
        achievement: { select: { id: true, name: true, description: true, icon: true } },
      },
      orderBy: { unlockedAt: "desc" },
    });

    const byAchievement = new Map<
      number,
      {
        id: number;
        name: string;
        description: string;
        icon: string | null;
        count: number;
        lastUnlockedAt: Date;
      }
    >();
    for (const row of unlockedRows) {
      const entry = byAchievement.get(row.achievement.id);
      if (entry) entry.count += 1;
      else byAchievement.set(row.achievement.id, { ...row.achievement, count: 1, lastUnlockedAt: row.unlockedAt });
    }

    const squadAchievements = [...byAchievement.values()]
      .sort((a, b) => b.count - a.count || b.lastUnlockedAt.getTime() - a.lastUnlockedAt.getTime())
      .slice(0, 8);

    return {
      squad: {
        id: squad.id,
        name: squad.name,
        description: squad.description,
        color: squad.color,
        manager: squad.manager,
      },
      stats: {
        memberCount: members.length,
        totalPoints,
        weekPoints,
        activeMembersThisWeek: members.filter((member) => member.weekPoints > 0).length,
        tasksTotal: tasks.length,
        tasksCompleted: completed.length,
        tasksOpen: open.length,
        tasksInProgress: tasks.filter((t) => t.status === "EM_ANDAMENTO").length,
        tasksOverdue: open.filter((t) => t.dueDate.getTime() < now).length,
        completionRate: percent(completed.length, tasks.length),
        onTimeRate: percent(onTime, deliveries),
        rank: mine?.position ?? standings.length + 1,
        squadsCount: mine ? standings.length : standings.length + 1,
        leaderPoints: standings[0]?.points ?? 0,
        pointsByDay,
      },
      members,
      missions,
      activity,
      achievements: squadAchievements,
    };
  });
};
