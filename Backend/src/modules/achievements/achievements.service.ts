import type { Prisma } from "../../../generated/prisma/client.js";
import type { AchievementType } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";
import { notify } from "../notifications/notifications.service.js";
import { applyPoints, getStreakDays } from "../points/points.service.js";

type Tx = Prisma.TransactionClient;

// Tipos que o sistema desbloqueia sozinho. CUSTOM só o admin concede.
export const AUTO_TYPES: AchievementType[] = [
  "TASK_COUNT",
  "POINTS_TOTAL",
  "STREAK",
  "RANKING",
  "TEAMWORK",
];

export interface UnlockedAchievement {
  id: number;
  name: string;
  icon: string | null;
  pointsBonus: number;
}

export interface Metrics {
  tasks?: number; // tarefas concluídas
  points?: number; // total de pontos
  streak?: number; // dias seguidos pontuando
  teamwork?: number; // missões cooperativas concluídas (com 2 ou mais responsáveis)
  companyPosition?: number | null; // posição no ranking da empresa
}

async function companyPosition(tx: Tx, userId: number) {
  const users = await tx.user.findMany({
    where: { status: "ACTIVE", role: { not: "ADMIN" } },
    select: { id: true, name: true },
  });

  const sums = await tx.pointTransaction.groupBy({
    by: ["userId"],
    where: { userId: { in: users.map((user) => user.id) } },
    _sum: { amount: true },
  });
  const pointsOf = new Map(sums.map((row) => [row.userId, row._sum.amount ?? 0]));

  const ranked = users
    .map((user) => ({ ...user, points: pointsOf.get(user.id) ?? 0 }))
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name) || a.id - b.id);

  const index = ranked.findIndex((user) => user.id === userId);
  return index === -1 ? null : index + 1;
}

// Calcula só as métricas que as conquistas pendentes realmente usam.
// As consultas rodam em sequência: dentro de uma transação elas dividem a mesma conexão.
export async function loadMetrics(tx: Tx, userId: number, types: Set<AchievementType>) {
  const metrics: Metrics = {};

  if (types.has("TASK_COUNT")) {
    metrics.tasks = await tx.taskAssignment.count({ where: { userId, status: "CONCLUIDA" } });
  }

  if (types.has("POINTS_TOTAL") || types.has("RANKING")) {
    const total = await tx.pointTransaction.aggregate({ where: { userId }, _sum: { amount: true } });
    metrics.points = total._sum.amount ?? 0;
  }

  if (types.has("STREAK")) {
    metrics.streak = await getStreakDays(userId, tx);
  }

  if (types.has("TEAMWORK")) {
    metrics.teamwork = await tx.taskAssignment.count({
      where: {
        userId,
        status: "CONCLUIDA",
        task: { assignments: { some: { userId: { not: userId } } } },
      },
    });
  }

  if (types.has("RANKING")) {
    metrics.companyPosition = await companyPosition(tx, userId);
  }

  return metrics;
}

export function meetsTarget(type: AchievementType, target: number, metrics: Metrics) {
  switch (type) {
    case "TASK_COUNT":
      return (metrics.tasks ?? 0) >= target;
    case "POINTS_TOTAL":
      return (metrics.points ?? 0) >= target;
    case "STREAK":
      return (metrics.streak ?? 0) >= target;
    case "TEAMWORK":
      return (metrics.teamwork ?? 0) >= target;
    case "RANKING":
      // "chegar ao top N": só vale para quem já tem pontos
      return (
        (metrics.points ?? 0) > 0 &&
        metrics.companyPosition != null &&
        metrics.companyPosition <= target
      );
    default:
      return false;
  }
}

// Desbloqueia uma conquista e paga o bônus como transação de pontos.
// A restrição única (usuário + conquista) impede duplicidade, até em requisições simultâneas.
export async function grantAchievement(
  tx: Tx,
  userId: number,
  achievement: UnlockedAchievement,
): Promise<UnlockedAchievement | null> {
  const created = await tx.userAchievement.createMany({
    data: [{ userId, achievementId: achievement.id }],
    skipDuplicates: true,
  });
  if (created.count === 0) return null;

  if (achievement.pointsBonus > 0) {
    await applyPoints(tx, {
      userId,
      amount: achievement.pointsBonus,
      type: "ACHIEVEMENT_UNLOCKED",
      description: `Conquista desbloqueada: ${achievement.name}`,
    });
  }

  await notify(tx, userId, {
    type: "ACHIEVEMENT",
    title: "Conquista desbloqueada!",
    message:
      achievement.pointsBonus > 0
        ? `${achievement.name} • +${achievement.pointsBonus} pts de bônus`
        : achievement.name,
    link: "/",
  });

  return {
    id: achievement.id,
    name: achievement.name,
    icon: achievement.icon,
    pointsBonus: achievement.pointsBonus,
  };
}

// Confere todas as conquistas ativas que o usuário ainda não tem e desbloqueia as que ele
// cumpriu. Roda de novo enquanto houver novidade, porque o bônus de uma conquista pode
// liberar outra (por exemplo, uma de pontuação).
export async function unlockEligibleAchievements(tx: Tx, userId: number) {
  const unlocked: UnlockedAchievement[] = [];

  for (let round = 0; round < 5; round += 1) {
    const pending = await tx.achievement.findMany({
      where: {
        isActive: true,
        type: { in: AUTO_TYPES },
        target: { not: null },
        users: { none: { userId } },
      },
      select: { id: true, name: true, icon: true, pointsBonus: true, type: true, target: true },
    });
    if (pending.length === 0) break;

    const metrics = await loadMetrics(tx, userId, new Set(pending.map((item) => item.type)));
    const eligible = pending.filter((item) => meetsTarget(item.type, item.target ?? 0, metrics));
    if (eligible.length === 0) break;

    for (const item of eligible) {
      const granted = await grantAchievement(tx, userId, item);
      if (granted) unlocked.push(granted);
    }
  }

  return unlocked;
}

// Aplica as conquistas a quem já cumpria a regra antes dela existir ou ser reativada.
// Uma transação por usuário, em sequência: serve para equipes pequenas e médias.
export async function backfillAchievements() {
  const users = await prisma.user.findMany({
    where: { status: "ACTIVE", role: { not: "ADMIN" } },
    select: { id: true },
  });

  let awarded = 0;
  for (const user of users) {
    const unlocked = await prisma.$transaction((tx) => unlockEligibleAchievements(tx, user.id));
    awarded += unlocked.length;
  }

  return awarded;
}
