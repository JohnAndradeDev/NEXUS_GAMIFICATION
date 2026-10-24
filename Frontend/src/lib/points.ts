import { api } from "./api";
import type { PointTransactionType } from "./squads";

export interface LevelProgress {
  level: number;
  currentXp: number;
  neededXp: number;
  percent: number;
  xpToNext: number;
}

export interface RankPosition {
  position: number;
  total: number;
}

export interface PointsSummary {
  experience: number;
  totalPoints: number;
  weekPoints: number;
  tasksCompleted: number;
  tasksTotal: number;
  completionRate: number;
  progress: LevelProgress;
  streakDays: number;
  squadRank: RankPosition | null;
  companyRank: RankPosition | null;
}

export function getPointsSummary() {
  return api<{ summary: PointsSummary }>("/points/me");
}

export type AdjustmentType = "TASK_BONUS" | "ADMIN_ADJUSTMENT" | "PENALTY";

export interface PointsHistoryItem {
  id: number;
  amount: number;
  type: PointTransactionType;
  description: string | null;
  createdAt: string;
  task: { id: number; title: string } | null;
}

export interface UserPointsHistory {
  items: PointsHistoryItem[];
  meta: { page: number; perPage: number; total: number; totalPages: number };
  totalPoints: number;
}

export function getUserPointsHistory(userId: number, perPage = 6) {
  return api<UserPointsHistory>(`/points/users/${userId}/history?perPage=${perPage}`);
}

export function createPointsAdjustment(body: {
  userId: number;
  type: AdjustmentType;
  amount: number; // sempre positivo; a penalidade tira pontos
  description: string;
}) {
  return api<{ user: { name: string; experience: number; level: number; achievements: { name: string }[] } }>(
    "/points/adjustments",
    { method: "POST", json: body },
  );
}
