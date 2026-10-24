interface XpToastProps {
  title: string;
  detail: string;
  onClose: () => void;
}

export function XpToast({ title, detail, onClose }: XpToastProps) {
  return (
    <div className="fixed bottom-24 right-4 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-space-sm sm:right-8 lg:bottom-6 rounded-xl bg-surface-container-highest px-space-md py-space-sm shadow-2xl transition-all duration-500 ease-out">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
        <span className="material-symbols-outlined text-sm font-bold">
          bolt
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-label-md text-label-md font-bold text-on-surface">
          {title}
        </span>
        <span className="font-body-sm text-body-sm text-tertiary">
          {detail}
        </span>
      </div>

      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="ml-space-sm text-outline transition-all hover:text-on-surface"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
