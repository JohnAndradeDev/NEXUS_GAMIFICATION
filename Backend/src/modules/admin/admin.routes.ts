import type { FastifyPluginAsync } from "fastify";
import { prisma } from "../../lib/prisma.js";

const round1 = (value: number) => Math.round(value * 10) / 10;
const percent = (part: number, total: number) => (total === 0 ? 0 : round1((part / total) * 100));

export const adminRoutes: FastifyPluginAsync = async (app) => {
  app.get("/metrics", { preHandler: app.authorize("ADMIN") }, async () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      usersActive,
      usersInactive,
      newUsersThisMonth,
      activeLastWeek,
      squads,
      membersInSquads,
      tasksTotal,
      tasksCompleted,
      xp,
    ] = await Promise.all([
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.user.count({ where: { status: "INACTIVE" } }),
      prisma.user.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.user.count({ where: { status: "ACTIVE", lastLoginAt: { gte: weekAgo } } }),
      prisma.squad.count({ where: { isActive: true } }),
      prisma.user.count({ where: { status: "ACTIVE", squadId: { not: null } } }),
      prisma.task.count(),
      prisma.task.count({ where: { status: "CONCLUIDA" } }),
      prisma.user.aggregate({ _sum: { experience: true } }),
    ]);

    const usersTotal = usersActive + usersInactive;

    return {
      metrics: {
        usersTotal,
        usersActive,
        usersInactive,
        newUsersThisMonth,
        activeRate: percent(usersActive, usersTotal),
        // engajamento = usuários ativos que fizeram login nos últimos 7 dias
        engagementRate: percent(activeLastWeek, usersActive),
        squads,
        membersPerSquad: squads === 0 ? 0 : round1(membersInSquads / squads),
        tasksTotal,
        tasksCompleted,
        completionRate: percent(tasksCompleted, tasksTotal),
        xpTotal: xp._sum.experience ?? 0,
      },
    };
  });
};
