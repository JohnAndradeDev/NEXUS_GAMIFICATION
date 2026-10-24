interface RemoveMemberModalProps {
  memberName: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveMemberModal({
  memberName,
  onClose,
  onConfirm,
}: RemoveMemberModalProps) {
  if (!memberName) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-surface-container p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-error-container/20 text-error">
          <span className="material-symbols-outlined text-2xl">warning</span>
        </div>

        <h3 className="font-headline-md text-headline-md text-on-surface">
          Confirmar Desvinculação
        </h3>

        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          Tem certeza de que deseja remover{" "}
          <strong className="text-on-surface">{memberName}</strong> do Squad
          CyberTitans? As permissões de acesso e tarefas em andamento serão
          revogadas.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-surface-container-high px-4 py-2.5 font-label-md text-label-md text-on-surface hover:bg-surface-container-highest sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-xl bg-error px-4 py-2.5 font-headline-sm text-headline-sm text-on-error shadow-lg sm:w-auto"
          >
            Remover Membro
          </button>
        </div>
      </div>
    </div>
  );
}
