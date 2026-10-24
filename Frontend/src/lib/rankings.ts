import { api } from "./api";
import type { Paginated } from "./users";

export type RankingPeriod = "week" | "month" | "all";

export interface RankingMe {
  position: number;
  points: number;
  delta: number;
  total: number;
}

export interface SquadStanding {
  id: number;
  name: string;
  description: string | null;
  memberCount: number;
  points: number;
  previousPoints: number;
  weekPoints: number;
  tasksTotal: number;
  tasksCompleted: number;
  position: number;
  previousPosition: number;
  delta: number;
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
  delta: number;
}

export type SquadRankingResponse = Paginated<SquadStanding> & { me: RankingMe | null };
export type UserRankingResponse = Paginated<UserStanding> & { me: RankingMe | null };

// Linha genérica da tela de ranking (serve para colaboradores e para squads)
export interface RankingEntry {
  key: string;
  position: number;
  title: string;
  subtitle: string;
  extra: string;
  points: number;
  delta: number;
  highlight: boolean;
  initials: string;
  avatarUrl: string | null;
}

function toQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  return query.toString();
}

export function getSquadRanking(
  params: { page?: number; perPage?: number; period?: RankingPeriod } = {},
) {
  return api<SquadRankingResponse>(`/rankings/squads?${toQuery(params)}`);
}

export function getUserRanking(
  params: { page?: number; perPage?: number; period?: RankingPeriod; squadId?: number } = {},
) {
  return api<UserRankingResponse>(`/rankings/users?${toQuery(params)}`);
}
