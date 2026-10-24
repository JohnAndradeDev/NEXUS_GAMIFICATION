import { createdAtFilter, periodWindows, type Period, type TimeWindow } from "../../lib/periods.js";
import { prisma } from "../../lib/prisma.js";

// Soma de pontos de cada usuário dentro de uma janela de tempo
export async function pointsByUser(userIds: number[], window: TimeWindow) {
  const rows = await prisma.pointTransaction.groupBy({
    by: ["userId"],
    where: { userId: { in: userIds }, ...createdAtFilter(window) },
    _sum: { amount: true },
  });

  return new Map(rows.map((row) => [row.userId, row._sum.amount ?? 0]));
}

export interface UserStanding {
  id: number;
  name: string;
  jobTitle: string | null;
  avatarUrl: string | null;
  level: number;
  squad: { id: number; name: string } | null;
  points: number;
  position: number;
  previousPosition: number;
  delta: number; // positivo = subiu posições em relação ao período anterior
}

// Ranking de colaboradores ativos (admins não entram).
// Ordem: pontos do período; no empate, ordem alfabética.
export async function getUserStandings(period: Period, squadId?: number): Promise<UserStanding[]> {
  const users = await prisma.user.findMany({
    where: {
      status: "ACTIVE",
      role: { not: "ADMIN" },
      ...(squadId !== undefined && { squadId }),
    },
    select: {
      id: true,
      name: true,
      jobTitle: true,
      avatarUrl: true,
      level: true,
      squad: { select: { id: true, name: true } },
    },
  });

  const ids = users.map((user) => user.id);
  const { current, previous } = periodWindows(period);
  const [nowPoints, beforePoints] = await Promise.all([
    pointsByUser(ids, current),
    pointsByUser(ids, previous),
  ]);

  const rows = users.map((user) => ({
    ...user,
    points: nowPoints.get(user.id) ?? 0,
    before: beforePoints.get(user.id) ?? 0,
  }));

  const byName = (a: { name: string; id: number }, b: { name: string; id: number }) =>
    a.name.localeCompare(b.name) || a.id - b.id;

  const ranked = [...rows].sort((a, b) => b.points - a.points || byName(a, b));
  const rankedBefore = [...rows].sort((a, b) => b.before - a.before || byName(a, b));
  const previousPositionOf = new Map(rankedBefore.map((row, index) => [row.id, index + 1]));

  return ranked.map((row, index) => {
    const position = index + 1;
    const previousPosition = previousPositionOf.get(row.id) ?? position;

    return {
      id: row.id,
      name: row.name,
      jobTitle: row.jobTitle,
      avatarUrl: row.avatarUrl,
      level: row.level,
      squad: row.squad,
      points: row.points,
      position,
      previousPosition,
      delta: previousPosition - position,
    };
  });
}
