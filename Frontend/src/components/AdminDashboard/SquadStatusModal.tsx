import type { AdminSquad } from "../../lib/squads";

interface SquadStatusModalProps {
  squad: AdminSquad | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function SquadStatusModal({
  squad,
  submitting,
  error,
  onClose,
  onConfirm,
}: SquadStatusModalProps) {
  if (!squad) return null;

  const deactivating = squad.isActive;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-surface-container-lowest/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg">
        <div className="mb-space-sm flex items-center gap-space-sm">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              deactivating ? "bg-error-container text-error" : "bg-tertiary/10 text-tertiary",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-2xl">
              {deactivating ? "warning" : "restart_alt"}
            </span>
          </div>

          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface">
              {deactivating ? "Desativar squad" : "Reativar squad"}
            </h4>
            <span className="font-body-sm text-body-sm text-outline">{squad.name}</span>
          </div>
        </div>

        <p className="my-space-md font-body-md text-body-md text-on-surface-variant">
          {deactivating ? (
            <>
              O squad <strong className="text-on-surface">{squad.name}</strong> sai do ranking e
              deixa de receber novas tarefas. Os membros, as tarefas e o histórico de pontos são
              mantidos, e você pode reativá-lo depois.
            </>
          ) : (
            <>
              O squad <strong className="text-on-surface">{squad.name}</strong> volta ao ranking e
              pode receber tarefas novamente.
            </>
          )}
        </p>

        {error && (
          <p role="alert" className="mb-space-sm font-body-sm text-body-sm text-error">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg bg-surface-container px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className={[
              "rounded-lg px-space-md py-space-xs font-label-md text-label-md shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
              deactivating ? "bg-error text-on-error" : "bg-primary-container text-on-primary-container",
            ].join(" ")}
          >
            {submitting ? "Salvando..." : deactivating ? "Desativar" : "Reativar"}
          </button>
        </div>
      </div>
    </div>
  );
}
