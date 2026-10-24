import type { Prisma } from "../../../generated/prisma/client.js";
import type { PointTransactionType } from "../../../generated/prisma/enums.js";
import { levelFromXp } from "../../lib/leveling.js";
import { notify } from "../notifications/notifications.service.js";
import { prisma } from "../../lib/prisma.js";

interface ApplyPointsInput {
  userId: number;
  amount: number;
  type: PointTransactionType;
  description?: string;
  taskId?: number;
}

// Registra a transação e atualiza XP e nível do usuário.
// Sempre chame dentro de prisma.$transaction para tudo ser gravado junto.
export async function applyPoints(tx: Prisma.TransactionClient, input: ApplyPointsInput) {
  await tx.pointTransaction.create({
    data: {
      userId: input.userId,
      amount: input.amount,
      type: input.type,
      description: input.description,
      taskId: input.taskId,
    },
  });

  const user = await tx.user.findUniqueOrThrow({
    where: { id: input.userId },
    select: { experience: true, level: true },
  });

  const experience = Math.max(0, user.experience + input.amount);
  const level = levelFromXp(experience);

  await tx.user.update({
    where: { id: input.userId },
    data: { experience, level },
  });

  if (level > user.level) {
    await notify(tx, input.userId, {
      type: "LEVEL_UP",
      title: "Você subiu de nível!",
      message: `Agora você é nível ${level}.`,
      link: "/",
    });
  }

  return { experience, level, previousLevel: user.level };
}

const DAY_MS = 24 * 60 * 60 * 1000;
// os dias são contados no fuso de Brasília (UTC-3, sem horário de verão)
const BRAZIL_OFFSET_MS = 3 * 60 * 60 * 1000;
const dayNumber = (date: Date) => Math.floor((date.getTime() - BRAZIL_OFFSET_MS) / DAY_MS);

// Sequência = dias seguidos com ao menos uma pontuação positiva.
// Continua valendo se o último dia ativo foi ontem.
export async function getStreakDays(userId: number, client: Prisma.TransactionClient = prisma) {
  const rows = await client.pointTransaction.findMany({
    where: {
      userId,
      amount: { gt: 0 },
      createdAt: { gte: new Date(Date.now() - 400 * DAY_MS) },
    },
    select: { createdAt: true },
  });

  const activeDays = new Set(rows.map((row) => dayNumber(row.createdAt)));
  const today = dayNumber(new Date());

  let day = activeDays.has(today) ? today : today - 1;
  let streak = 0;
  while (activeDays.has(day)) {
    streak += 1;
    day -= 1;
  }
  return streak;
}

export interface Position {
  position: number;
  total: number;
}

// Posição do usuário no squad e na empresa (admins não entram no ranking).
// Empate: ordem alfabética, a mesma regra do ranking de squads.
export async function getUserPositions(userId: number, squadId: number | null) {
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", role: { not: "ADMIN" } },
    select: { id: true, name: true, squadId: true },
  });

  const sums = await prisma.pointTransaction.groupBy({
    by: ["userId"],
    where: { userId: { in: users.map((user) => user.id) } },
    _sum: { amount: true },
  });
  const pointsOf = new Map(sums.map((row) => [row.userId, row._sum.amount ?? 0]));

  const ranked = users
    .map((user) => ({ ...user, points: pointsOf.get(user.id) ?? 0 }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));

  const positionIn = (list: typeof ranked): Position | null => {
    const index = list.findIndex((user) => user.id === userId);
    return index === -1 ? null : { position: index + 1, total: list.length };
  };

  return {
    companyRank: positionIn(ranked),
    squadRank: squadId === null ? null : positionIn(ranked.filter((user) => user.squadId === squadId)),
  };
}
