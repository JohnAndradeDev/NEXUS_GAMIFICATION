interface ToastNotificationProps {
  message: string | null;
  onClose: () => void;
}

export function ToastNotification({ message, onClose }: ToastNotificationProps) {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 right-4 z-80 max-w-[calc(100vw-2rem)] sm:bottom-8 sm:right-8">
      <div className="flex items-center gap-3 rounded-xl border border-surface-container-high bg-surface-container-highest px-4 py-3.5 text-on-surface shadow-2xl">
        <span
          className="material-symbols-outlined text-2xl text-tertiary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          check_circle
        </span>

        <div className="flex min-w-0 flex-col">
          <span className="font-label-md text-label-md font-bold text-on-surface">
            Ação Executada
          </span>

          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {message}
          </span>
        </div>

        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="ml-2 shrink-0 text-outline hover:text-on-surface"
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>
    </div>
  );
}
