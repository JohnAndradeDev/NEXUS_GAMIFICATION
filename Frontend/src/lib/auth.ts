import type { User } from "../contexts/AuthContext";
import { api } from "./api";

export function changePassword(currentPassword: string, newPassword: string) {
  return api<void>("/auth/change-password", {
    method: "PATCH",
    json: { currentPassword, newPassword },
  });
}

/** `avatarUrl` é um data URL já reduzido (veja lib/image.ts). */
export function updateAvatar(avatarUrl: string) {
  return api<{ user: User }>("/auth/me/avatar", {
    method: "PATCH",
    json: { avatarUrl },
  });
}

export function removeAvatar() {
  return api<{ user: User }>("/auth/me/avatar", { method: "DELETE" });
}
