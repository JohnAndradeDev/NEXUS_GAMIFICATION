interface AdminHeaderProps {
  onNewUser: () => void;
}

export function AdminHeader({ onNewUser }: AdminHeaderProps) {
  return (
    <section className="mb-space-lg flex flex-col justify-between gap-space-md sm:flex-row sm:items-center">
      <div className="flex flex-col gap-space-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm uppercase tracking-widest text-primary">
            Core Engine • Governance Console
          </span>

          <span className="flex items-center gap-1.5 rounded-full bg-secondary-container px-2.5 py-0.5 text-on-secondary-container">
            <span className="material-symbols-outlined animate-spin text-xs text-secondary">
              shield_locked
            </span>

            <span className="font-label-sm text-label-sm font-bold">
              Administrador Geral
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-space-sm">
          <h1 className="font-display-lg-mobile text-2xl tracking-tight text-on-surface sm:font-display-lg sm:text-display-lg">
            Painel de Administração Global
          </h1>

          <span className="hidden font-headline-sm text-headline-sm text-outline md:inline">
            / NEXUS Enterprise
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onNewUser}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-space-md py-2.5 font-label-md text-label-md text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.35)] transition-all hover:brightness-110 sm:w-auto"
      >
        <span className="material-symbols-outlined text-lg">person_add</span>
        Novo Usuário
      </button>
    </section>
  );
}
