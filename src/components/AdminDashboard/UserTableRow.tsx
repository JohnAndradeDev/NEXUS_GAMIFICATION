interface AdminUser {
  name: string;
  initials: string;
  email: string;
  role: string;
  description: string;
  sector: string;
  squad: string;
  profile: string;
  xp: number;
  lastAccess: string;
  status: string;
}

interface UserTableRowProps {
  user: AdminUser;
  onStatusChange: (userName: string, action: "Desativar" | "Reativar") => void;
  onAction: (message: string) => void;
}

export function UserTableRow({
  user,
  onStatusChange,
  onAction,
}: UserTableRowProps) {
  const isActive = user.status === "Ativo";

  return (
    <tr
      className={[
        "transition-colors hover:bg-surface-container-high/60",
        !isActive && "opacity-60",
      ].join(" ")}
    >
      <td className="px-space-md py-space-sm">
        <div className="flex items-center gap-space-sm">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
            {user.initials}

            <span
              className={[
                "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full",
                isActive ? "bg-tertiary" : "bg-outline-variant",
              ].join(" ")}
            />
          </div>

          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              {user.name}
            </span>

            <span className="font-body-sm text-body-sm text-outline">
              {user.description}
            </span>
          </div>
        </div>
      </td>

      <td className="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">
        {user.email}
      </td>

      <td className="px-space-md py-space-sm">
        <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-on-surface">
          {user.role}
        </span>
      </td>

      <td className="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">
        {user.sector}
      </td>

      <td className="px-space-md py-space-sm font-label-sm text-label-sm text-primary">
        {user.squad}
      </td>

      <td className="px-space-md py-space-sm">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm text-primary">
          <span className="material-symbols-outlined text-xs">
            {user.profile === "Admin"
              ? "workspace_premium"
              : user.profile === "Gestor"
                ? "shield_person"
                : "person"}
          </span>

          {user.profile}
        </span>
      </td>

      <td className="px-space-md py-space-sm">
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-label-sm text-label-sm",
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

          {user.status}
        </span>
      </td>

      <td className="px-space-md py-space-sm">
        <div className="flex items-center gap-1 font-label-md text-label-md text-primary">
          <span className="material-symbols-outlined text-sm">bolt</span>
          {user.xp.toLocaleString("pt-BR")} XP
        </div>
      </td>

      <td className="px-space-md py-space-sm font-body-sm text-body-sm text-outline">
        {user.lastAccess}
      </td>

      <td className="px-space-md py-space-sm text-right">
        <div className="flex items-center justify-end gap-1 text-on-surface-variant">
          <button
            type="button"
            title="Ver detalhes"
            onClick={() => onAction(`Abrindo detalhes de ${user.name}.`)}
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">
              visibility
            </span>
          </button>

          <button
            type="button"
            title="Editar"
            onClick={() => onAction(`Carregando editor de ${user.name}.`)}
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>

          <button
            type="button"
            title="Alterar cargo ou squad"
            onClick={() => onAction(`Abrindo realocação de ${user.name}.`)}
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-secondary"
          >
            <span className="material-symbols-outlined text-lg">
              manage_accounts
            </span>
          </button>

          <button
            type="button"
            title={isActive ? "Desativar" : "Reativar"}
            onClick={() =>
              onStatusChange(user.name, isActive ? "Desativar" : "Reativar")
            }
            className="rounded p-1 transition-colors hover:bg-surface-variant hover:text-error"
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
