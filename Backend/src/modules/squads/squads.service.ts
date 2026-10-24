import { periodWindows, type Period } from "../../lib/periods.js";
import { prisma } from "../../lib/prisma.js";
import { pointsByUser } from "../rankings/rankings.service.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export interface SquadStanding {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  points: number; // pontos do período escolhido
  previousPoints: number;
  weekPoints: number; // sempre os últimos 7 dias
  tasksTotal: number;
  tasksCompleted: number;
  position: number;
  previousPosition: number;
  delta: number; // positivo = subiu posições em relação ao período anterior
}

interface Row {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  points: number;
  previousPoints: number;
  weekPoints: number;
  tasksTotal: number;
  tasksCompleted: number;
}

// Ranking de todos os squads ativos. A pontuação do squad é a soma da
// pontuação dos membros ativos; no empate, vale a ordem alfabética.
// Sem período, vale todo o histórico (comportamento original).
export async function getSquadStandings(period: Period = "all"): Promise<SquadStanding[]> {
  const { current, previous } = periodWindows(period);
  const weekWindow = { from: new Date(Date.now() - 7 * DAY_MS) };

  const [squads, members, taskCounts, doneCounts] = await Promise.all([
    prisma.squad.findMany({
      where: { isActive: true },
      select: { id: true, name: true, description: true },
    }),
    prisma.user.findMany({
      where: { status: "ACTIVE", squad: { isActive: true } },
      select: { id: true, squadId: true },
    }),
    prisma.task.groupBy({
      by: ["squadId"],
      where: { status: { not: "CANCELADA" } },
      _count: { _all: true },
    }),
    prisma.task.groupBy({
      by: ["squadId"],
      where: { status: "CONCLUIDA" },
      _count: { _all: true },
    }),
  ]);

  const memberIds = members.map((member) => member.id);
  const [pointsNow, pointsBefore, pointsWeek] = await Promise.all([
    pointsByUser(memberIds, current),
    pointsByUser(memberIds, previous),
    pointsByUser(memberIds, weekWindow),
  ]);

  const tasksTotalOf = new Map(taskCounts.map((row) => [row.squadId, row._count._all]));
  const tasksDoneOf = new Map(doneCounts.map((row) => [row.squadId, row._count._all]));

  const rows: Row[] = squads.map((squad) => ({
    id: squad.id,
    name: squad.name,
    description: squad.description,
    memberCount: 0,
    points: 0,
    previousPoints: 0,
    weekPoints: 0,
    tasksTotal: tasksTotalOf.get(squad.id) ?? 0,
    tasksCompleted: tasksDoneOf.get(squad.id) ?? 0,
  }));

  const rowById = new Map(rows.map((row) => [row.id, row]));
  for (const member of members) {
    const row = member.squadId === null ? undefined : rowById.get(member.squadId);
    if (!row) continue;
    row.memberCount += 1;
    row.points += pointsNow.get(member.id) ?? 0;
    row.previousPoints += pointsBefore.get(member.id) ?? 0;
    row.weekPoints += pointsWeek.get(member.id) ?? 0;
  }

  const current_ = [...rows].sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  const before = [...rows].sort(
    (a, b) => b.previousPoints - a.previousPoints || a.name.localeCompare(b.name),
  );
  const previousPositionOf = new Map(before.map((row, index) => [row.id, index + 1]));

  return current_.map((row, index) => {
    const position = index + 1;
    const previousPosition = previousPositionOf.get(row.id) ?? position;
    return { ...row, position, previousPosition, delta: previousPosition - position };
  });
}
