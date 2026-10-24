import { api } from "./api";
import type { Paginated } from "./users";

export type AchievementType =
  | "TASK_COUNT"
  | "POINTS_TOTAL"
  | "STREAK"
  | "RANKING"
  | "TEAMWORK"
  | "CUSTOM";

// ---------- do usuário ----------

export interface UnlockedAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string | null;
  pointsBonus: number;
  unlockedAt: string;
}

export interface NextAchievement {
  name: string;
  description: string;
  icon: string | null;
  progress: number;
  remaining: number;
  unit: string;
}

export interface AchievementsData {
  unlocked: UnlockedAchievement[];
  unlockedCount: number;
  next: NextAchievement | null;
}

export function getMyAchievements() {
  return api<AchievementsData>("/achievements/me");
}

// ---------- do admin ----------

export const ACHIEVEMENT_TYPES: {
  value: AchievementType;
  label: string;
  hint: string;
  needsTarget: boolean;
}[] = [
  {
    value: "TASK_COUNT",
    label: "Missões concluídas",
    hint: "Desbloqueia ao concluir a quantidade de missões definida na meta.",
    needsTarget: true,
  },
  {
    value: "POINTS_TOTAL",
    label: "Pontos acumulados",
    hint: "Desbloqueia ao somar a quantidade de pontos definida na meta.",
    needsTarget: true,
  },
  {
    value: "STREAK",
    label: "Sequência de dias",
    hint: "Desbloqueia ao pontuar por dias seguidos, conforme a meta.",
    needsTarget: true,
  },
  {
    value: "RANKING",
    label: "Posição no ranking",
    hint: "Desbloqueia ao chegar ao top N do ranking da empresa (N é a meta). Exige ter pontos.",
    needsTarget: true,
  },
  {
    value: "TEAMWORK",
    label: "Missões em equipe",
    hint: "Conta missões concluídas que tinham dois ou mais responsáveis.",
    needsTarget: true,
  },
  {
    value: "CUSTOM",
    label: "Concedida manualmente",
    hint: "Só o administrador concede, pelo botão Conceder.",
    needsTarget: false,
  },
];

export function ruleText(type: AchievementType, target: number | null) {
  const n = target ?? 0;

  switch (type) {
    case "TASK_COUNT":
      return `Concluir ${n} ${n === 1 ? "missão" : "missões"}`;
    case "POINTS_TOTAL":
      return `Alcançar ${n} pontos`;
    case "STREAK":
      return `Pontuar por ${n} ${n === 1 ? "dia seguido" : "dias seguidos"}`;
    case "RANKING":
      return `Chegar ao top ${n} do ranking da empresa`;
    case "TEAMWORK":
      return `Concluir ${n} ${n === 1 ? "missão cooperativa" : "missões cooperativas"}`;
    default:
      return "Concedida manualmente pelo administrador";
  }
}

export interface AdminAchievement {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string | null;
  type: AchievementType;
  target: number | null;
  pointsBonus: number;
  isActive: boolean;
  unlockedCount: number;
  createdAt: string;
}

export function listAchievements(params: {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: "true" | "false" | "";
}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  return api<Paginated<AdminAchievement>>(`/achievements?${query.toString()}`);
}

export interface AchievementInput {
  name: string;
  description: string;
  icon: string | null;
  type: AchievementType;
  target: number | null;
  pointsBonus: number;
}

export function createAchievement(body: AchievementInput & { code: string }) {
  return api<{ achievement: { id: number; name: string }; awarded: number }>("/achievements", {
    method: "POST",
    json: body,
  });
}

export function updateAchievement(id: number, body: Partial<AchievementInput>) {
  return api<{ achievement: { id: number }; awarded: number }>(`/achievements/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export function setAchievementStatus(id: number, isActive: boolean) {
  return api<{ achievement: { id: number; isActive: boolean }; awarded: number }>(
    `/achievements/${id}/status`,
    { method: "PATCH", json: { isActive } },
  );
}

export function awardAchievement(id: number, userId: number) {
  return api<{
    userName: string;
    granted: { id: number; name: string };
    others: { id: number; name: string }[];
  }>(`/achievements/${id}/award`, { method: "POST", json: { userId } });
}

export function recalculateAchievements() {
  return api<{ awarded: number }>("/achievements/recalculate", { method: "POST" });
}

export function awardedText(awarded: number) {
  if (awarded === 0) return "";
  return ` ${awarded} ${awarded === 1 ? "conquista concedida" : "conquistas concedidas"} a quem já cumpria a regra.`;
}
