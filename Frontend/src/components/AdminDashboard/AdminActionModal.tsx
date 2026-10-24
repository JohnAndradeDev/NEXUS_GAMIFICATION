interface AdminActionModalProps {
  userName: string | null;
  action: "Desativar" | "Reativar" | null;
  onClose: () => void;
  onConfirm: () => void;
  submitting?: boolean;
  error?: string | null;
}

export function AdminActionModal({
  userName,
  action,
  onClose,
  onConfirm,
  submitting = false,
  error = null,
}: AdminActionModalProps) {
  if (!userName || !action) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-surface-container-lowest/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg">
        <div className="mb-space-sm flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-container text-error">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>

          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface">
              Confirmar Alteração de Status
            </h4>

            <span className="font-body-sm text-body-sm text-outline">
              Acesso do colaborador à plataforma
            </span>
          </div>
        </div>

        <p className="my-space-md font-body-md text-body-md text-on-surface-variant">
          Tem certeza de que deseja{" "}
          <strong className="text-on-surface">{action.toLowerCase()}</strong> o
          colaborador <strong className="text-on-surface">{userName}</strong> no
          NEXUS? O status de suas missões e acessos será afetado.
        </p>

        {error && (
          <p
            role="alert"
            className="mb-space-sm font-body-sm text-body-sm text-error"
          >
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg bg-surface-container px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="rounded-lg bg-error px-space-md py-space-xs font-label-md text-label-md text-on-error shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Salvando..." : action}
          </button>
        </div>
      </div>
    </div>
  );
}
