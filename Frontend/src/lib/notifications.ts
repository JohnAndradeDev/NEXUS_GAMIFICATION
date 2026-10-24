import { api } from "./api";
import type { Paginated } from "./users";

export type NotificationType =
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "TASK_REMOVED"
  | "TASK_CANCELED"
  | "TASK_COMPLETED"
  | "POINTS"
  | "ACHIEVEMENT"
  | "LEVEL_UP"
  | "SQUAD";

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export type NotificationsResponse = Paginated<AppNotification> & { unreadCount: number };

export function listNotifications(params: { page?: number; perPage?: number; unread?: boolean } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.perPage) query.set("perPage", String(params.perPage));
  if (params.unread) query.set("unread", "true");
  return api<NotificationsResponse>(`/notifications?${query.toString()}`);
}

export function getUnreadCount() {
  return api<{ unreadCount: number }>("/notifications/unread-count");
}

export function markNotificationRead(id: number) {
  return api<void>(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return api<void>("/notifications/read-all", { method: "PATCH" });
}
