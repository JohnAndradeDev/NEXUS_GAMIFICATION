import type { RosterMember } from "../../lib/squads";

interface RemoveMemberModalProps {
  member: RosterMember | null;
  squadName: string;
  submitting: boolean;
  error: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveMemberModal({
  member,
  squadName,
  submitting,
  error,
  onClose,
  onConfirm,
}: RemoveMemberModalProps) {
  if (!member) return null;

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-surface-container p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-error-container/20 text-error">
          <span className="material-symbols-outlined text-2xl">warning</span>
        </div>

        <h3 className="font-headline-md text-headline-md text-on-surface">
          Confirmar Desvinculação
        </h3>

        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          Tem certeza de que deseja remover{" "}
          <strong className="text-on-surface">{member.name}</strong> do Squad {squadName}?
          As tarefas não concluídas dele neste squad serão desvinculadas. O histórico de pontos
          e as tarefas já concluídas são mantidos.
        </p>

        {error && (
          <p role="alert" className="mt-3 font-body-sm text-body-sm text-error">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full rounded-xl bg-surface-container-high px-4 py-2.5 font-label-md text-label-md text-on-surface hover:bg-surface-container-highest disabled:opacity-60 sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="w-full rounded-xl bg-error px-4 py-2.5 font-headline-sm text-headline-sm text-on-error shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {submitting ? "Removendo..." : "Remover Membro"}
          </button>
        </div>
      </div>
    </div>
  );
}
