import type { ApiTask } from "../../lib/tasks";

interface CancelTaskModalProps {
  task: ApiTask | null;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelTaskModal({
  task,
  submitting,
  error,
  onClose,
  onConfirm,
}: CancelTaskModalProps) {
  if (!task) return null;

  const hasCompleted = task.assignments.some((a) => a.status === "CONCLUIDA");

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-surface-container-lowest/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg">
        <div className="mb-space-sm flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-container text-error">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>

          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface">Cancelar tarefa</h4>
            <span className="font-body-sm text-body-sm text-outline">Esta ação não tem volta</span>
          </div>
        </div>

        <p className="my-space-md font-body-md text-body-md text-on-surface-variant">
          Tem certeza de que deseja cancelar a tarefa{" "}
          <strong className="text-on-surface">"{task.title}"</strong>? Ela deixa de aparecer para
          os responsáveis e não pode mais ser concluída.
          {hasCompleted && " Os pontos de quem já concluiu ficam mantidos no histórico."}
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
            Voltar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="rounded-lg bg-error px-space-md py-space-xs font-label-md text-label-md text-on-error shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Cancelando..." : "Cancelar tarefa"}
          </button>
        </div>
      </div>
    </div>
  );
}
