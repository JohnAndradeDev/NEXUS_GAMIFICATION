import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { AppError } from "../../lib/errors.js";
import { levelProgress } from "../../lib/leveling.js";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";
import { unlockEligibleAchievements } from "../achievements/achievements.service.js";
import { notifySafe } from "../notifications/notifications.service.js";
import { applyPoints, getStreakDays, getUserPositions } from "./points.service.js";

const round1 = (value: number) => Math.round(value * 10) / 10;

// Valor sempre positivo: quem define o sinal é o tipo (penalidade tira pontos).
// Pontuação negativa só existe como penalidade, como pede o README.
const adjustmentBody = z.object({
  userId: z.number().int().positive(),
  type: z.enum(["TASK_BONUS", "ADMIN_ADJUSTMENT", "PENALTY"]),
  amount: z.number().int().min(1, "Informe um valor maior que zero").max(10000),
  description: z.string().trim().min(3, "Descreva o motivo do ajuste").max(200),
});

export const pointsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/me", { preHandler: app.authenticate }, async (req) => {
    const userId = req.user.sub;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { experience: true, squadId: true },
    });

    const [total, week, tasksCompleted, tasksTotal, streakDays, positions] = await Promise.all([
      prisma.pointTransaction.aggregate({ where: { userId }, _sum: { amount: true } }),
      prisma.pointTransaction.aggregate({
        where: { userId, createdAt: { gte: weekAgo } },
        _sum: { amount: true },
      }),
      prisma.taskAssignment.count({ where: { userId, status: "CONCLUIDA" } }),
      prisma.taskAssignment.count({
        where: { userId, task: { status: { not: "CANCELADA" } } },
      }),
      getStreakDays(userId),
      getUserPositions(userId, user.squadId),
    ]);

    return {
      summary: {
        experience: user.experience,
        // a pontuação vem do histórico de transações
        totalPoints: total._sum.amount ?? 0,
        weekPoints: week._sum.amount ?? 0,
        tasksCompleted,
        tasksTotal,
        completionRate: tasksTotal === 0 ? 0 : round1((tasksCompleted / tasksTotal) * 100),
        progress: levelProgress(user.experience),
        streakDays,
        squadRank: positions.squadRank,
        companyRank: positions.companyRank,
      },
    };
  });

  app.get("/me/history", { preHandler: app.authenticate }, async (req) => {
    const { page, perPage } = paginationSchema.parse(req.query);
    const where = { userId: req.user.sub };

    const [items, total] = await prisma.$transaction([
      prisma.pointTransaction.findMany({
        where,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          createdAt: true,
          task: { select: { id: true, title: true } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.pointTransaction.count({ where }),
    ]);

    return { items, meta: paginationMeta(page, perPage, total) };
  });

  // ---- histórico de pontos de qualquer usuário (admin) ----
  app.get("/users/:id/history", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { id } = z.object({ id: z.coerce.number().int().positive() }).parse(req.params);
    const { page, perPage } = paginationSchema.parse(req.query);
    const where = { userId: id };

    const [items, total, sum] = await prisma.$transaction([
      prisma.pointTransaction.findMany({
        where,
        select: {
          id: true,
          amount: true,
          type: true,
          description: true,
          createdAt: true,
          task: { select: { id: true, title: true } },
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.pointTransaction.count({ where }),
      prisma.pointTransaction.aggregate({ where, _sum: { amount: true } }),
    ]);

    return {
      items,
      meta: paginationMeta(page, perPage, total),
      totalPoints: sum._sum.amount ?? 0,
    };
  });

  // ---- bônus, ajuste administrativo e penalidade (somente admin) ----
  app.post("/adjustments", { preHandler: app.authorize("ADMIN") }, async (req, reply) => {
    const { userId, type, amount, description } = adjustmentBody.parse(req.body);
    const signed = type === "PENALTY" ? -amount : amount;

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, status: true, role: true },
      });
      if (!user) throw new AppError(404, "Usuário não encontrado");
      if (user.role === "ADMIN") throw new AppError(400, "Administradores não têm pontuação");
      if (user.status !== "ACTIVE") throw new AppError(409, "Este usuário está desativado");

      if (signed < 0) {
        const total = await tx.pointTransaction.aggregate({
          where: { userId },
          _sum: { amount: true },
        });
        const current = total._sum.amount ?? 0;
        if (current + signed < 0) {
          throw new AppError(
            409,
            `A penalidade deixaria a pontuação negativa (saldo atual: ${current} pts)`,
          );
        }
      }

      // o histórico nunca é apagado: o ajuste vira uma transação nova
      await applyPoints(tx, { userId, amount: signed, type, description });

      // somar pontos pode cumprir uma conquista por pontuação
      const achievements = signed > 0 ? await unlockEligibleAchievements(tx, userId) : [];

      const final = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { experience: true, level: true },
      });

      return {
        name: user.name,
        experience: final.experience,
        level: final.level,
        achievements,
      };
    });

    await notifySafe(userId, {
      type: "POINTS",
      title:
        type === "PENALTY"
          ? "Penalidade aplicada"
          : type === "TASK_BONUS"
            ? "Você recebeu um bônus"
            : "Ajuste de pontuação",
      message: `${signed > 0 ? "+" : ""}${signed} pts • ${description}`,
      link: "/",
    });

    return reply.status(201).send({ adjustment: { userId, type, amount: signed }, user: result });
  });
};
