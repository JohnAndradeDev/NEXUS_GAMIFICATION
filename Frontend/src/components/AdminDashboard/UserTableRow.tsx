import { useAuth, type Role } from "../../contexts/AuthContext";
import {
  ROLE_LABEL,
  formatLastAccess,
  getInitials,
  type ApiUser,
} from "../../lib/users";

// cor do chip de perfil: admin em violeta, gestor em ciano, usuário comum neutro
const ROLE_STYLE: Record<Role, string> = {
  ADMIN: "bg-secondary-container/40 text-secondary",
  GESTOR: "bg-primary-container/25 text-primary",
  USER: "bg-surface-container-highest text-on-surface-variant",
};

const ROLE_ICON: Record<Role, string> = {
  ADMIN: "workspace_premium",
  GESTOR: "shield_person",
  USER: "person",
};

interface UserTableRowProps {
  user: ApiUser;
  onStatusChange: (user: ApiUser, action: "Desativar" | "Reativar") => void;
  onEdit: (user: ApiUser) => void;
  onPoints: (user: ApiUser) => void;
}

// Linha da tabela larga (a partir de 2xl). A tabela usa colunas de largura fixa,
// então textos longos são cortados com reticências; o texto completo fica no title.
export function UserTableRow({
  user,
  onStatusChange,
  onEdit,
  onPoints,
}: UserTableRowProps) {
  const { user: me } = useAuth();
  const isSelf = me?.id === user.id;
  const isActive = user.status === "ACTIVE";

  return (
    <tr
      className={[
        "transition-colors hover:bg-surface-container-high/60",
        isActive ? "" : "opacity-60",
      ].join(" ")}
    >
      <td className="px-3 py-space-sm">
        <div className="flex min-w-0 items-center gap-space-sm">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
            {getInitials(user.name)}

            <span
              className={[
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full",
                isActive ? "bg-tertiary" : "bg-outline-variant",
              ].join(" ")}
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <span
              title={user.name}
              className="truncate font-label-md text-label-md font-bold text-on-surface"
            >
              {user.name}
            </span>
            <span
              title={user.email}
              className="truncate font-body-sm text-body-sm text-outline"
            >
              {user.email}
            </span>
          </div>
        </div>
      </td>

      <td className="px-3 py-space-sm">
        <div className="flex min-w-0 flex-col items-start gap-0.5">
          <span
            title={user.jobTitle ?? undefined}
            className="max-w-full truncate rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-on-surface"
          >
            {user.jobTitle ?? "—"}
          </span>
          <span className="max-w-full truncate font-body-sm text-body-sm text-outline">
            {user.sector ?? "—"}
          </span>
        </div>
      </td>

      <td className="px-3 py-space-sm">
        <span
          title={user.squad?.name}
          className="block truncate font-label-sm text-label-sm text-primary"
        >
          {user.squad?.name ?? "—"}
        </span>
      </td>

      <td className="px-3 py-space-sm">
        <span
          className={[
            "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-label-sm text-label-sm",
            ROLE_STYLE[user.role],
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-xs">
            {ROLE_ICON[user.role]}
          </span>
          {ROLE_LABEL[user.role]}
        </span>
      </td>

      <td className="px-3 py-space-sm">
        <span
          className={[
            "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-label-sm text-label-sm",
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
      </td>

      <td className="px-3 py-space-sm">
        <div className="flex flex-col">
          <span className="flex items-center gap-1 whitespace-nowrap font-label-md text-label-md text-primary">
            <span className="material-symbols-outlined text-sm">bolt</span>
            {user.experience.toLocaleString("pt-BR")} XP
          </span>
          <span className="font-body-sm text-body-sm text-outline">
            Nível {user.level}
          </span>
        </div>
      </td>

      <td className="px-3 py-space-sm font-body-sm text-body-sm text-outline">
        {formatLastAccess(user.lastLoginAt)}
      </td>

      <td className="px-3 py-space-sm text-right">
        <div className="flex items-center justify-end gap-0.5 text-on-surface-variant">
          <button
            type="button"
            title="Pontuação e ajustes"
            onClick={() => onPoints(user)}
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">stars</span>
          </button>

          <button
            type="button"
            title="Editar cargo, setor, perfil ou squad"
            onClick={() => onEdit(user)}
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>

          <button
            type="button"
            title={isActive ? "Desativar" : "Reativar"}
            onClick={() =>
              onStatusChange(user, isActive ? "Desativar" : "Reativar")
            }
            disabled={isSelf}
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-error disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-lg">
              {isActive ? "toggle_on" : "toggle_off"}
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
}
