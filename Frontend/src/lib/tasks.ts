import { api } from "./api";
import type { LevelProgress } from "./points";
import type { Paginated } from "./users";

export type TaskDifficulty = "FACIL" | "MEDIO" | "DIFICIL";
export type TaskStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "ATRASADA" | "CANCELADA";
export type AssignmentStatus = "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "ATRASADA";

export interface TaskAssignment {
  id: number;
  userId: number;
  status: AssignmentStatus;
  progress: number;
  pointsAwarded: number;
  completedAt: string | null;
  user: { id: number; name: string };
}

export interface ApiTask {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  priority: number;
  difficulty: TaskDifficulty;
  basePoints: number;
  status: TaskStatus;
  startDate: string | null;
  dueDate: string;
  completedAt: string | null;
  squadId: number;
  squad: { id: number; name: string };
  assignments: TaskAssignment[];
  isOverdue: boolean;
}

export interface Reward extends LevelProgress {
  pointsAwarded: number;
  experience: number;
  leveledUp: boolean;
  achievements: { id: number; name: string; icon: string | null; pointsBonus: number }[];
}

export interface ListTasksParams {
  page?: number;
  perPage?: number;
  status?: TaskStatus;
  difficulty?: TaskDifficulty;
  search?: string;
  overdue?: "true";
}

export function listTasks(params: ListTasksParams = {}) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) query.set(key, String(value));
  }
  return api<Paginated<ApiTask>>(`/tasks?${query.toString()}`);
}

export function updateTaskStatus(id: number, status: "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA") {
  return api<{ reward: Reward | null }>(`/tasks/${id}/status`, {
    method: "PATCH",
    json: { status },
  });
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatDue(iso: string) {
  const due = new Date(iso);
  const now = new Date();
  const startOfDay = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const diffDays = Math.round((startOfDay(due) - startOfDay(now)) / 86_400_000);
  const time = due.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (diffDays === 0) return `Hoje, ${time}`;
  if (diffDays === 1) return "Amanhã";
  if (diffDays === -1) return "Ontem";
  if (diffDays > 1 && diffDays < 7) {
    return capitalize(due.toLocaleDateString("pt-BR", { weekday: "long" }));
  }
  return due.toLocaleDateString("pt-BR");
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  category?: string;
  difficulty: TaskDifficulty;
  priority: number; // 1 baixa, 2 média, 3 alta
  startDate?: string;
  dueDate: string;
  assigneeIds: number[];
}

export function createTask(body: CreateTaskInput) {
  return api<{ task: { id: number; title: string; basePoints: number } }>("/tasks", {
    method: "POST",
    json: body,
  });
}

export interface UpdateTaskInput {
  title?: string;
  description?: string | null;
  category?: string | null;
  difficulty?: TaskDifficulty;
  priority?: number;
  startDate?: string | null;
  dueDate?: string;
}

export function updateTask(id: number, body: UpdateTaskInput) {
  return api<{ task: { id: number; title: string; basePoints: number } }>(`/tasks/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export function addTaskAssignees(id: number, userIds: number[]) {
  return api<{ added: number }>(`/tasks/${id}/assignments`, {
    method: "POST",
    json: { userIds },
  });
}

export function removeTaskAssignee(id: number, userId: number) {
  return api<void>(`/tasks/${id}/assignments/${userId}`, { method: "DELETE" });
}
