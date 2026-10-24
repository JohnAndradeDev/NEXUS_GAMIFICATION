import type { Role } from "../contexts/AuthContext";
import { ApiError, api } from "./api";

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface Squad {
  id: number;
  name: string;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  sector: string | null;
  jobTitle: string | null;
  avatarUrl: string | null;
  level: number;
  experience: number;
  squadId: number | null;
  squad: Squad | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  items: T[];
  meta: { page: number; perPage: number; total: number; totalPages: number };
}

export interface AdminMetricsData {
  usersTotal: number;
  usersActive: number;
  usersInactive: number;
  newUsersThisMonth: number;
  activeRate: number;
  engagementRate: number;
  squads: number;
  membersPerSquad: number;
  tasksTotal: number;
  tasksCompleted: number;
  completionRate: number;
  xpTotal: number;
}

export const SECTORS = [
  "Engenharia",
  "Produto",
  "Design",
  "Dados",
  "Infraestrutura",
] as const;

export const JOB_TITLES = [
  "Desenvolvedor",
  "Analista de QA",
  "Tech Lead",
  "Product Manager",
  "UI/UX Designer",
] as const;

export const ROLE_LABEL: Record<Role, string> = {
  USER: "Usuário Comum",
  GESTOR: "Gestor",
  ADMIN: "Admin",
};

export const ROLE_STYLE: Record<Role, string> = {
  ADMIN: "bg-amber-500/15  text-amber-300",
  GESTOR: "bg-purple-500/14 text-purple-300",
  USER: "bg-red-500/16 text-red-300",
};

/** Lista de opções que inclui o valor atual, mesmo que ele não esteja na lista padrão. */
export function withCurrent(list: readonly string[], current: string | null) {
  return current && !list.includes(current) ? [...list, current] : [...list];
}

export interface ListUsersParams {
  page?: number;
  perPage?: number;
  search?: string;
  role?: Role | "";
  status?: UserStatus | "";
  sector?: string;
  sort?: "xp-desc" | "xp-asc" | "name-asc";
}

export function listUsers(params: ListUsersParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  return api<Paginated<ApiUser>>(`/users?${query.toString()}`);
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  status: UserStatus;
  sector?: string;
  jobTitle?: string;
  squadId: number | null;
}

export function createUser(body: CreateUserInput) {
  return api<{ user: ApiUser }>("/users", { method: "POST", json: body });
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: Role;
  sector?: string | null;
  jobTitle?: string | null;
  squadId?: number | null;
}

export function updateUser(id: number, body: UpdateUserInput) {
  return api<{ user: ApiUser }>(`/users/${id}`, {
    method: "PATCH",
    json: body,
  });
}

export function setUserStatus(id: number, status: UserStatus) {
  return api<{ user: ApiUser }>(`/users/${id}/status`, {
    method: "PATCH",
    json: { status },
  });
}

export function listSquads() {
  return api<{ items: Squad[] }>("/squads");
}

export function getAdminMetrics() {
  return api<{ metrics: AdminMetricsData }>("/admin/metrics");
}

export function getErrorMessages(err: unknown): string[] {
  if (err instanceof ApiError) {
    return err.errors?.length
      ? err.errors.map((e) => e.message)
      : [err.message];
  }
  return ["Erro inesperado. Tente novamente."];
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatLastAccess(iso: string | null) {
  if (!iso) return "Nunca acessou";

  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Agora mesmo";
  if (minutes < 60) return `Há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Há ${hours} h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `Há ${days} ${days === 1 ? "dia" : "dias"}`;

  return new Date(iso).toLocaleDateString("pt-BR");
}
