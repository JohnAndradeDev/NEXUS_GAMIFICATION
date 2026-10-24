import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { Prisma } from "../../../generated/prisma/client.js";
import type { AchievementType } from "../../../generated/prisma/enums.js";
import { AppError } from "../../lib/errors.js";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";
import {
  backfillAchievements,
  grantAchievement,
  loadMetrics,
  unlockEligibleAchievements,
} from "./achievements.service.js";

const idParams = z.object({ id: z.coerce.number().int().positive() });

const typeEnum = z.enum(["TASK_COUNT", "POINTS_TOTAL", "STREAK", "RANKING", "TEAMWORK", "CUSTOM"]);

const iconSchema = z
  .string()
  .trim()
  .max(60)
  .regex(/^[a-z0-9_]+$/, "Use o nome de um ícone do Material Symbols, em minúsculas")
  .nullable();

const targetSchema = z.number().int().min(1).max(100000);

const createBody = z
  .object({
    code: z
      .string()
      .trim()
      .toLowerCase()
      .min(2)
      .max(40)
      .regex(/^[a-z0-9-]+$/, "O código aceita letras minúsculas, números e hífen"),
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().min(3).max(200),
    icon: iconSchema.optional(),
    type: typeEnum,
    target: targetSchema.nullable().optional(),
    pointsBonus: z.number().int().min(0).max(1000).default(0),
  })
  .refine((data) => data.type === "CUSTOM" || data.target != null, {
    message: "Informe a meta (valor-alvo) da conquista",
    path: ["target"],
  });

const updateBody = z
  .object({
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().min(3).max(200),
    icon: iconSchema,
    type: typeEnum,
    target: targetSchema.nullable(),
    pointsBonus: z.number().int().min(0).max(1000),
  })
  .partial();

// o que cada tipo mede, para calcular o progresso da "próxima conquista"
const PROGRESS_TYPES: AchievementType[] = ["TASK_COUNT", "POINTS_TOTAL", "STREAK", "TEAMWORK"];
const UNIT: Record<string, string> = {
  TASK_COUNT: "missões",
  POINTS_TOTAL: "pontos",
  STREAK: "dias",
  TEAMWORK: "missões em equipe",
};

export const achievementsRoutes: FastifyPluginAsync = async (app) => {
  // ---- conquistas do usuário logado: últimas desbloqueadas e a próxima da fila ----
  app.get("/me", { preHandler: app.authenticate }, async (req) => {
    const userId = req.user.sub;

    const [unlocked, unlockedCount, catalog] = await Promise.all([
      prisma.userAchievement.findMany({
        where: { userId },
        orderBy: [{ unlockedAt: "desc" }, { id: "desc" }],
        take: 5,
        select: {
          unlockedAt: true,
          achievement: {
            select: {
              id: true,
              code: true,
              name: true,
              description: true,
              icon: true,
              pointsBonus: true,
            },
          },
        },
      }),
      prisma.userAchievement.count({ where: { userId } }),
      prisma.achievement.findMany({
        where: {
          isActive: true,
          target: { not: null },
          type: { in: PROGRESS_TYPES },
          users: { none: { userId } },
        },
        select: { name: true, description: true, icon: true, type: true, target: true },
      }),
    ]);

    const metrics = await loadMetrics(prisma, userId, new Set(catalog.map((item) => item.type)));

    const candidates = catalog
      .map((item) => {
        const target = item.target ?? 1;
        const current =
          item.type === "TASK_COUNT"
            ? (metrics.tasks ?? 0)
            : item.type === "POINTS_TOTAL"
              ? (metrics.points ?? 0)
              : item.type === "STREAK"
                ? (metrics.streak ?? 0)
                : (metrics.teamwork ?? 0);

        return {
          name: item.name,
          description: item.description,
          icon: item.icon,
          target,
          progress: Math.min(100, Math.round((current / target) * 100)),
          remaining: Math.max(0, target - current),
          unit: UNIT[item.type] ?? "",
        };
      })
      .filter((item) => item.progress < 100)
      .sort((a, b) => b.progress - a.progress || a.target - b.target);

    const next = candidates[0];

    return {
      unlocked: unlocked.map((row) => ({ ...row.achievement, unlockedAt: row.unlockedAt })),
      unlockedCount,
      next: next
        ? {
            name: next.name,
            description: next.description,
            icon: next.icon,
            progress: next.progress,
            remaining: next.remaining,
            unit: next.unit,
          }
        : null,
    };
  });

  // ---- catálogo completo (admin), inclusive as desativadas ----
  app.get("/", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { page, perPage, search, isActive } = paginationSchema
      .extend({
        search: z.string().trim().optional(),
        isActive: z.enum(["true", "false"]).optional(),
      })
      .parse(req.query);

    const where: Prisma.AchievementWhereInput = {
      ...(isActive && { isActive: isActive === "true" }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };

    const [rows, total] = await prisma.$transaction([
      prisma.achievement.findMany({
        where,
        select: {
          id: true,
          code: true,
          name: true,
          description: true,
          icon: true,
          type: true,
          target: true,
          pointsBonus: true,
          isActive: true,
          createdAt: true,
          _count: { select: { users: true } },
        },
        orderBy: [{ isActive: "desc" }, { name: "asc" }, { id: "asc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.achievement.count({ where }),
    ]);

    const items = rows.map(({ _count, ...row }) => ({ ...row, unlockedCount: _count.users }));

    return { items, meta: paginationMeta(page, perPage, total) };
  });

  // ---- criar ----
  app.post("/", { preHandler: app.authorize("ADMIN") }, async (req, reply) => {
    const body = createBody.parse(req.body);

    if (await prisma.achievement.findUnique({ where: { code: body.code }, select: { id: true } })) {
      throw new AppError(409, "Já existe uma conquista com esse código");
    }

    const achievement = await prisma.achievement.create({
      data: {
        code: body.code,
        name: body.name,
        description: body.description,
        icon: body.icon ?? null,
        type: body.type,
        target: body.type === "CUSTOM" ? null : (body.target ?? null),
        pointsBonus: body.pointsBonus,
      },
      select: { id: true, name: true },
    });

    // quem já cumpria a regra recebe agora, sem esperar o próximo evento
    const awarded = await backfillAchievements();

    return reply.status(201).send({ achievement, awarded });
  });

  // ---- editar ----
  app.patch("/:id", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const body = updateBody.parse(req.body);

    const current = await prisma.achievement.findUnique({
      where: { id },
      select: { type: true, target: true, isActive: true, _count: { select: { users: true } } },
    });
    if (!current) throw new AppError(404, "Conquista não encontrada");

    const nextType = body.type ?? current.type;
    let nextTarget = body.target !== undefined ? body.target : current.target;
    if (nextType === "CUSTOM") nextTarget = null;
    else if (nextTarget == null) throw new AppError(400, "Informe a meta (valor-alvo) da conquista");

    // depois que alguém desbloqueou, a regra não muda: o que foi conquistado continua valendo
    const ruleChanged = nextType !== current.type || nextTarget !== current.target;
    if (ruleChanged && current._count.users > 0) {
      throw new AppError(
        409,
        "Depois que alguém desbloqueou, só nome, descrição, ícone e bônus podem mudar",
      );
    }

    await prisma.achievement.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.icon !== undefined && { icon: body.icon }),
        ...(body.pointsBonus !== undefined && { pointsBonus: body.pointsBonus }),
        ...(ruleChanged && { type: nextType, target: nextTarget }),
      },
    });

    const awarded = current.isActive ? await backfillAchievements() : 0;

    return { achievement: { id }, awarded };
  });

  // ---- ativar e desativar (o que já foi desbloqueado permanece no histórico) ----
  app.patch("/:id/status", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const { isActive } = z.object({ isActive: z.boolean() }).parse(req.body);

    const exists = await prisma.achievement.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new AppError(404, "Conquista não encontrada");

    await prisma.achievement.update({ where: { id }, data: { isActive } });

    const awarded = isActive ? await backfillAchievements() : 0;

    return { achievement: { id, isActive }, awarded };
  });

  // ---- conceder manualmente (qualquer tipo; é a única forma para CUSTOM) ----
  app.post("/:id/award", { preHandler: app.authorize("ADMIN") }, async (req, reply) => {
    const { id } = idParams.parse(req.params);
    const { userId } = z.object({ userId: z.number().int().positive() }).parse(req.body);

    const result = await prisma.$transaction(async (tx) => {
      const achievement = await tx.achievement.findUnique({
        where: { id },
        select: { id: true, name: true, icon: true, pointsBonus: true, isActive: true },
      });
      if (!achievement) throw new AppError(404, "Conquista não encontrada");
      if (!achievement.isActive) {
        throw new AppError(409, "Conquistas desativadas não podem ser concedidas");
      }

      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { name: true, status: true, role: true },
      });
      if (!user) throw new AppError(404, "Usuário não encontrado");
      if (user.role === "ADMIN") throw new AppError(400, "Administradores não recebem conquistas");
      if (user.status !== "ACTIVE") throw new AppError(409, "Este usuário está desativado");

      const granted = await grantAchievement(tx, userId, achievement);
      if (!granted) throw new AppError(409, "Este usuário já desbloqueou esta conquista");

      // o bônus pode ter liberado outras conquistas por pontuação
      const others = await unlockEligibleAchievements(tx, userId);

      return { userName: user.name, granted, others };
    });

    return reply.status(201).send(result);
  });

  // ---- reaplicar as regras a todos (útil depois de importar ou ajustar o catálogo) ----
  app.post("/recalculate", { preHandler: app.authorize("ADMIN") }, async () => {
    const awarded = await backfillAchievements();
    return { awarded };
  });
};
