import { useState } from "react";
import { useAuth, type Role } from "../../contexts/AuthContext";
import { usePoints } from "../../contexts/PointsContext";
import { useLogout } from "../../hooks/useLogout";
import { changePassword, removeAvatar, updateAvatar } from "../../lib/auth";
import { getInitials } from "../../lib/users";
import { NotificationBell } from "./NotificationBell";
import { UserProfileModal } from "./UserProfileModal";

const ROLE_LABEL: Record<Role, string> = {
  USER: "Colaborador",
  GESTOR: "Gestor",
  ADMIN: "Administrador",
};

export function Header() {
  const { user, refreshUser } = useAuth();
  const logout = useLogout();
  const { summary } = usePoints();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!user) return null;

  const squadLabel =
    user.squad?.name ?? (user.role === "ADMIN" ? "Administração" : "Sem squad");

  async function handleAvatarChange(avatarDataUrl: string) {
    await updateAvatar(avatarDataUrl);
    await refreshUser(); // atualiza a foto no header e no resto do app
  }

  async function handleAvatarRemove() {
    await removeAvatar();
    await refreshUser();
  }

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/80 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-gutter lg:left-72 lg:h-20">
        <div className="flex min-w-0 items-center gap-2 sm:gap-space-md">
          <div className="flex min-w-0 items-center gap-space-xs rounded-full bg-surface-container px-2.5 py-1 shadow-[0_0_12px_rgba(6,182,212,0.15)] sm:px-space-md sm:py-space-xs">
            <span className="material-symbols-outlined shrink-0 text-base text-primary sm:text-lg">
              shield
            </span>

            <span className="truncate font-label-md text-label-md text-on-surface sm:font-label-lg sm:text-label-lg">
              {squadLabel}{" "}
              {user.sector && (
                <span className="hidden font-body-sm font-normal text-outline sm:inline">
                  ({user.sector})
                </span>
              )}
            </span>
          </div>

          <div className="hidden items-center gap-1.5 overflow-x-auto py-1 md:flex lg:gap-space-sm">
            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-container-low px-2 py-1 sm:px-space-sm sm:py-space-xs">
              <span className="material-symbols-outlined text-sm text-primary sm:text-base">
                bolt
              </span>
              <span className="font-label-sm text-label-sm text-on-surface sm:font-label-md sm:text-label-md">
                {user.experience.toLocaleString("pt-BR")}{" "}
                <span className="text-outline">XP</span>
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-container-low px-2 py-1 sm:px-space-sm sm:py-space-xs">
              <span className="material-symbols-outlined animate-pulse text-sm text-error sm:text-base">
                local_fire_department
              </span>
              <span className="font-label-sm text-label-sm text-on-surface sm:font-label-md sm:text-label-md">
                {summary ? `${summary.streakDays}D` : "—"}{" "}
                <span className="hidden text-outline xl:inline">Streak</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-space-md lg:gap-space-lg">
          {/* Sino de Notificações Integrado */}
          <NotificationBell />

          {/* Botão de Perfil que abre a Modal */}
          <button
            id="open-profile-modal-btn"
            type="button"
            onClick={() => setIsProfileOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isProfileOpen}
            title="Abrir Perfil do Usuário e Segurança"
            className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-surface-container-low px-1.5 py-1 text-left transition-all hover:bg-surface-container hover:ring-1 hover:ring-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:gap-space-sm sm:px-space-sm sm:py-space-xs"
          >
            <div className="relative shrink-0">
              {user.avatarUrl ? (
                <img
                  alt={`Perfil de ${user.name}`}
                  className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
                  src={user.avatarUrl}
                />
              ) : (
                <div
                  aria-label={`Perfil de ${user.name}`}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-container text-[11px] font-semibold text-on-primary-container sm:h-8 sm:w-8"
                >
                  {getInitials(user.name)}
                </div>
              )}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-tertiary ring-2 ring-surface-container-low sm:h-2.5 sm:w-2.5" />
            </div>

            <div className="hidden flex-col text-left sm:flex">
              <span className="font-label-md text-label-md leading-tight text-on-surface">
                {user.name}
              </span>
              <span className="font-label-sm text-label-sm leading-none text-primary-fixed-dim">
                Nível {user.level} • {ROLE_LABEL[user.role]}
              </span>
            </div>

            <span
              aria-hidden="true"
              className="material-symbols-outlined hidden text-base text-outline sm:inline"
            >
              expand_more
            </span>
          </button>

          <button
            type="button"
            onClick={logout}
            aria-label="Sair"
            title="Sair"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-error sm:h-10 sm:w-10"
          >
            <span className="material-symbols-outlined text-lg sm:text-xl">
              logout
            </span>
          </button>
        </div>
      </header>

      <UserProfileModal
        open={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={logout}
        onChangePassword={changePassword}
        onAvatarChange={handleAvatarChange}
        onAvatarRemove={handleAvatarRemove}
        profile={{
          name: user.name,
          initials: getInitials(user.name),
          avatarUrl: user.avatarUrl,
          level: user.level,
          roleLabel: ROLE_LABEL[user.role],
          squadLabel,
          sector: user.sector,
          email: user.email,
          experience: user.experience,
          streakDays: summary?.streakDays ?? null,
        }}
      />
    </>
  );
}
