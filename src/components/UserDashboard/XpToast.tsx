export function XpToast() {
  return (
    <div className="fixed bottom-6 right-8 z-50 flex items-center gap-space-sm rounded-xl bg-surface-container-highest px-space-md py-space-sm shadow-2xl transition-all duration-500 ease-out">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-tertiary-container text-on-tertiary-container">
        <span className="material-symbols-outlined text-sm font-bold">
          bolt
        </span>
      </div>

      <div className="flex flex-col">
        <span className="font-label-md text-label-md font-bold text-on-surface">
          Parabéns! +25 XP Concedidos
        </span>
        <span className="font-body-sm text-body-sm text-tertiary">
          Daily Check-in validado com sucesso
        </span>
      </div>

      <button className="ml-space-sm text-outline transition-all hover:text-on-surface">
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
}
