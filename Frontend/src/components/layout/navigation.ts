import type { Role } from "../../contexts/AuthContext";

export type ActivePage = "user" | "mySquad" | "manager" | "squad" | "admin" | "ranking";

export interface NavItem {
  key: ActivePage;
  to: string;
  label: string;
  shortLabel: string;
  icon: string;
  roles: Role[];
}

// Cada cargo vê apenas os próprios itens. Os caminhos seguem as rotas
// de UserRoutes, ManagerRoutes e AdminRoutes.
export const NAV_ITEMS: NavItem[] = [
  {
    key: "user",
    to: "/",
    label: "Dashboard (Usuário)",
    shortLabel: "Usuário",
    icon: "dashboard",
    roles: ["USER"],
  },
  {
    key: "mySquad",
    to: "/squad",
    label: "Meu Squad",
    shortLabel: "Squad",
    icon: "groups",
    roles: ["USER"],
  },
  {
    key: "manager",
    to: "/",
    label: "Dashboard do Gestor",
    shortLabel: "Gestor",
    icon: "supervisor_account",
    roles: ["GESTOR"],
  },
  {
    key: "squad",
    to: "/manage-squad",
    label: "Gerenciar Squad",
    shortLabel: "Squad",
    icon: "shield_person",
    roles: ["GESTOR"],
  },
  {
    key: "admin",
    to: "/",
    label: "Painel Admin",
    shortLabel: "Admin",
    icon: "admin_panel_settings",
    roles: ["ADMIN"],
  },
  {
    key: "ranking",
    to: "/ranking",
    label: "Ranking",
    shortLabel: "Ranking",
    icon: "leaderboard",
    roles: ["USER", "GESTOR", "ADMIN"],
  },
];

export function getNavItems(role: Role) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
