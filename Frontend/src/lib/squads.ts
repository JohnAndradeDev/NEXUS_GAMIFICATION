import type { Role } from "../contexts/AuthContext";
import { api } from "./api";
import type { AssignmentStatus, TaskDifficulty, TaskStatus } from "./tasks";
import type { Paginated } from "./users";

export interface SquadMember {
  id: number;
  name: string;
  jobTitle: string | null;
  avatarUrl: string | null;
  level: number;
  role: Role;
  isManager: boolean;
  points: number;
  weekPoints: number;
  lastLoginAt: string | null;
}

export interface SquadMission {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: TaskDifficulty;
  basePoints: number;
  status: TaskStatus;
  dueDate: string;
  completedAt: string | null;
  isOverdue: boolean;
  progress: number;
  assignees: { id: number; name: string }[];
}

export type PointTransactionType =
  | "TASK_COMPLETED"
  | "TASK_BONUS"
  | "ACHIEVEMENT_UNLOCKED"
  | "ADMIN_ADJUSTMENT"
  | "PENALTY";

export interface SquadActivityItem {
  id: number;
  amount: number;
  type: PointTransactionType;
  description: string | null;
  createdAt: string;
  user: { id: number; name: string };
  task: { id: number; title: string } | null;
}

export interface SquadStatsData {
  memberCount: number;
  totalPoints: number;
  weekPoints: number;
  activeMembersThisWeek: number;
  tasksTotal: number;
  tasksCompleted: number;
  tasksOpen: number;
  completionRate: number;
  onTimeRate: number;
  tasksInProgress: number;
  tasksOverdue: number;
  rank: number;
  squadsCount: number;
  leaderPoints: number;
  pointsByDay: number[];
}

export interface SquadAchievement {
  id: number;
  name: string;
  description: string;
  icon: string | null;
  count: number;
  lastUnlockedAt: string;
}

export interface SquadOverview {
  squad: {
    id: number;
    name: string;
    description: string | null;
    color: string | null;
    manager: { id: number; name: string } | null;
  };
  stats: SquadStatsData;
  members: SquadMember[];
  missions: SquadMission[];
  activity: SquadActivityItem[];
  achievements: SquadAchievement[];
}

export function getSquadOverview(squadId: number) {
  return api<SquadOverview>(`/squads/${squadId}/overview`);
}

// ---------- gerenciamento do squad (gestor) ----------

export interface RosterQueueItem {
  taskId: number;
  title: string;
  status: AssignmentStatus;
  dueDate: string;
}

export interface RosterMember {
  id: number;
  name: string;
  email: string;
  jobTitle: string | null;
  sector: string | null;
  level: number;
  role: Role;
  isManager: boolean;
  position: number;
  points: number;
  share: number;
  tasksCompleted: number;
  tasksPending: number;
  progress: number;
  onTimeRate: number;
  achievements: { id: number; name: string; description: string; icon: string | null }[];
  queue: RosterQueueItem[];
}

export interface Roster {
  squad: {
    id: number;
    name: string;
    description: string | null;
    isActive: boolean;
    managerId: number | null;
  };
  stats: {
    memberCount: number;
    totalPoints: number;
    averagePoints: number;
    onTimeRate: number;
  };
  members: RosterMember[];
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  jobTitle: string | null;
  sector: string | null;
  level: number;
}

export function getRoster(squadId: number) {
  return api<Roster>(`/squads/${squadId}/members`);
}

export function getCandidates(squadId: number, search: string) {
  const query = new URLSearchParams({ perPage: "10" });
  if (search) query.set("search", search);
  return api<Paginated<Candidate>>(`/squads/${squadId}/candidates?${query.toString()}`);
}

export function addSquadMember(squadId: number, userId: number) {
  return api<{ member: { id: number; name: string } }>(`/squads/${squadId}/members`, {
    method: "POST",
    json: { userId },
  });
}

export function removeSquadMember(squadId: number, userId: number) {
  return api<void>(`/squads/${squadId}/members/${userId}`, { method: "DELETE" });
}

// ---------- administração de squads (admin) ----------

export interface AdminSquad {
  id: number;
  name: string;
  description: string | null;
  isActive: boolean;
  manager: { id: number; name: string } | null;
  memberCount: number;
  createdAt: string;
}

export interface ListAllSquadsParams {
  page?: number;
  perPage?: number;
  search?: string;
  isActive?: "true" | "false" | "";
}

export function listAllSquads(params: ListAllSquadsParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  return api<Paginated<AdminSquad>>(`/squads/all?${query.toString()}`);
}

export function createSquad(body: {
  name: string;
  description?: string;
  managerId?: number | null;
}) {
  return api<{ squad: { id: number; name: string } }>("/squads", {
    method: "POST",
    json: body,
  });
}

export function updateSquad(
  id: number,
  body: { name?: string; description?: string | null; managerId?: number | null },
) {
  return api<{ squad: { id: number } }>(`/squads/${id}`, { method: "PATCH", json: body });
}

export function setSquadStatus(id: number, isActive: boolean) {
  return api<{ squad: { id: number; isActive: boolean } }>(`/squads/${id}/status`, {
    method: "PATCH",
    json: { isActive },
  });
}
