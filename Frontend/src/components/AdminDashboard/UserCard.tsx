import type { ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  ROLE_LABEL,
  formatLastAccess,
  getInitials,
  type ApiUser,
} from "../../lib/users";

interface UserCardProps {
  user: ApiUser;
  onStatusChange: (user: ApiUser, action: "Desativar" | "Reativar") => void;
  onEdit: (user: ApiUser) => void;
  onPoints: (user: ApiUser) => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
        {label}
      </dt>
      <dd className="truncate font-body-sm text-body-sm text-on-surface">
        {children}
      </dd>
    </div>
  );
}

const actionButtonClass =
  "flex h-14 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg bg-surface-container px-1 font-label-md text-[11px] leading-none text-on-surface transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:flex-row sm:gap-1.5 sm:px-2 sm:text-label-md sm:leading-normal";

// Versão em cartão da linha da tabela, usada em telas menores
export function UserCard({
  user,
  onStatusChange,
  onEdit,
  onPoints,
}: UserCardProps) {
  const { user: me } = useAuth();
  const isSelf = me?.id === user.id;
  const isActive = user.status === "ACTIVE";

  return (
    <article
      className={[
        "rounded-xl border border-outline-variant/20 bg-surface-container-low p-space-md",
        isActive ? "" : "opacity-60",
      ].join(" ")}
    >
      <header className="flex items-start gap-space-sm">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
          {getInitials(user.name)}

          <span
            className={[
              "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full",
              isActive ? "bg-tertiary" : "bg-outline-variant",
            ].join(" ")}
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-label-md text-label-md font-bold text-on-surface">
            {user.name}
          </p>
          <p className="truncate font-body-sm text-body-sm text-outline">
            {user.email}
          </p>
        </div>

        <span
          className={[
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 font-label-sm text-label-sm",
            isActive
              ? "bg-tertiary-container/30 text-tertiary"
              : "bg-surface-container-high text-outline",
          ].join(" ")}
        >
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              isActive ? "bg-tertiary" : "bg-outline",
            ].join(" ")}
          />
          {isActive ? "Ativo" : "Desativado"}
        </span>
      </header>

      <dl className="mt-space-md grid grid-cols-2 gap-x-space-md gap-y-space-sm">
        <Field label="Cargo">{user.jobTitle ?? "—"}</Field>
        <Field label="Setor">{user.sector ?? "—"}</Field>
        <Field label="Squad">{user.squad?.name ?? "—"}</Field>
        <Field label="Perfil">{ROLE_LABEL[user.role]}</Field>
        <Field label="XP">
          {user.experience.toLocaleString("pt-BR")} XP • Nível {user.level}
        </Field>
        <Field label="Último acesso">{formatLastAccess(user.lastLoginAt)}</Field>
      </dl>

      <div className="mt-space-md grid grid-cols-3 gap-2 border-t border-outline-variant/20 pt-space-sm">
        <button
          type="button"
          onClick={() => onPoints(user)}
          className={actionButtonClass}
        >
          <span className="material-symbols-outlined shrink-0 text-lg">stars</span>
          <span className="max-w-full truncate">Pontos</span>
        </button>

        <button
          type="button"
          onClick={() => onEdit(user)}
          className={actionButtonClass}
        >
          <span className="material-symbols-outlined shrink-0 text-lg">edit</span>
          <span className="max-w-full truncate">Editar</span>
        </button>

        <button
          type="button"
          disabled={isSelf}
          onClick={() =>
            onStatusChange(user, isActive ? "Desativar" : "Reativar")
          }
          className={actionButtonClass}
        >
          <span className="material-symbols-outlined shrink-0 text-lg">
            {isActive ? "toggle_on" : "toggle_off"}
          </span>
          <span className="max-w-full truncate">{isActive ? "Desativar" : "Reativar"}</span>
        </button>
      </div>
    </article>
  );
}
