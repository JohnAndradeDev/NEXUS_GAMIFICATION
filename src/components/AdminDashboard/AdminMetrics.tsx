export function AdminMetrics() {
  return (
    <section className="mb-space-xl grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Total Usuários
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">group</span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          148
        </span>

        <div className="mt-1 flex items-center gap-1 text-tertiary">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span className="font-label-sm text-label-sm">+12 no mês</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Ativos
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              how_to_reg
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-tertiary-fixed-dim sm:text-metric-display">
          136
        </span>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
          </span>

          <span className="font-label-sm text-label-sm text-on-surface-variant">
            91.8% online
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Desativados
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-outline sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              person_off
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface-variant sm:text-metric-display">
          12
        </span>

        <div className="mt-1 flex items-center gap-1 text-outline">
          <span className="material-symbols-outlined text-sm">archive</span>
          <span className="font-label-sm text-label-sm">Preservados</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Squads
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-fixed-dim sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">hub</span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          14
        </span>

        <div className="mt-1 flex items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-sm">diversity_2</span>
          <span className="font-label-sm text-label-sm">10.5 devs/squad</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Missões Criadas
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-secondary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              assignment
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          1.240
        </span>

        <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">cycle</span>
          <span className="font-label-sm text-label-sm">Sprint 2025.Q1</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Concluídas
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              task_alt
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-tertiary sm:text-metric-display">
          1.092
        </span>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
          <div className="h-full w-[88%] rounded-full bg-tertiary" />
        </div>

        <span className="mt-1 block font-label-sm text-label-sm text-tertiary">
          88% taxa
        </span>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Engajamento
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              vital_signs
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          92.4%
        </span>

        <div className="mt-1 flex items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-sm">insights</span>
          <span className="font-label-sm text-label-sm">+4.1% vs ant.</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            XP Global
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">bolt</span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-primary sm:text-metric-display">
          184.5k
        </span>

        <div className="mt-1 flex items-center gap-1 text-secondary">
          <span className="material-symbols-outlined text-sm">stars</span>
          <span className="font-label-sm text-label-sm">46.2k SQ Coins</span>
        </div>
      </div>
    </section>
  );
}
