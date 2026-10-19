interface AdminToastProps {
  message: string | null;
  onClose: () => void;
}

export function AdminToast({ message, onClose }: AdminToastProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-4 z-[80] flex max-w-sm items-center gap-space-sm rounded-xl border border-outline-variant/30 bg-surface-container-highest px-space-md py-space-sm shadow-2xl sm:right-8 sm:max-w-md">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-tertiary-container text-on-tertiary-container">
        <span className="material-symbols-outlined text-lg">verified</span>
      </div>

      <div className="flex flex-1 flex-col">
        <span className="font-label-md text-label-md text-on-surface">
          Operação Concluída
        </span>

        <span className="font-body-sm text-body-sm text-tertiary">
          {message}
        </span>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="ml-2 shrink-0 text-outline hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
