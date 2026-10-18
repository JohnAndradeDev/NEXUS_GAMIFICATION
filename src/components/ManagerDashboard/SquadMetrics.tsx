export function SquadMetrics() {
  return (
    <section className="mb-space-xl grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md transition-all hover:bg-surface-container sm:p-space-md">
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/10 blur-xl" />

        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">
            Pontuação Total
          </span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              military_tech
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              13.420
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              pts
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-tertiary">
              trending_up
            </span>
            <span className="font-label-sm text-label-sm text-tertiary">
              +1.250
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              esta semana
            </span>
          </div>
        </div>

        <svg
          className="mt-space-md h-6 w-full text-primary"
          viewBox="0 0 100 24"
          fill="none"
        >
          <path
            d="M0 20 L20 18 L40 12 L60 14 L80 6 L100 2"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0 20 L20 18 L40 12 L60 14 L80 6 L100 2 V24 H0 Z"
            fill="currentColor"
            fillOpacity="0.12"
          />
        </svg>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">
            Posição Geral
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary-container/30 text-secondary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              leaderboard
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-secondary">
              #2
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              no Ranking Global
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-secondary">
              flag
            </span>
            <span className="font-label-sm text-label-sm text-on-surface">
              1.470 pts
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              p/ líder
            </span>
          </div>
        </div>

        <div className="mt-space-md">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full w-[90.1%] rounded-full bg-secondary" />
          </div>

          <div className="mt-1 flex items-center justify-between font-label-sm text-label-sm text-outline">
            <span>90.1% do líder</span>
            <span>14.890 pts</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">
            Membros Ativos
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">groups</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              8
            </span>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim">
              / 8 online
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
            <span className="font-label-sm text-label-sm text-tertiary">
              100% Engajados
            </span>
          </div>
        </div>

        <div className="mt-space-md flex items-center -space-x-2 overflow-hidden py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold ring-2 ring-surface-container-low">
            LM
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-xs font-bold ring-2 ring-surface-container-low">
            BL
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-tertiary text-xs font-bold ring-2 ring-surface-container-low">
            RS
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-highest text-xs text-primary ring-2 ring-surface-container-low">
            +5
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">
            Tarefas Feitas
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-tertiary-container/30 text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              task_alt
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              64
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              / 72 metas
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-tertiary">
              check_circle
            </span>
            <span className="font-label-sm text-label-sm text-tertiary">
              88.8% Sucesso
            </span>
          </div>
        </div>

        <div className="mt-space-md flex items-center gap-space-sm">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full w-[88.8%] rounded-full bg-tertiary" />
          </div>
          <span className="shrink-0 font-label-sm text-label-sm text-outline">
            8 Rest.
          </span>
        </div>
      </div>

      <div className="col-span-2 flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md md:col-span-1 sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">
            Em Risco & Backlog
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-error-container/40 text-error sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">warning</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              6
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              em andamento
            </span>
          </div>

          <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-error-container px-space-xs py-0.5 font-label-sm text-label-sm text-on-error-container">
            <span className="material-symbols-outlined text-xs">
              priority_high
            </span>
            2 Atrasadas
          </span>
        </div>

        <div className="mt-space-md flex items-center justify-between font-label-sm text-label-sm text-outline">
          <span>Atenção necessária</span>
          <span className="flex items-center gap-0.5 text-error">
            <span className="h-1.5 w-1.5 rounded-full bg-error" />
            Crítico
          </span>
        </div>
      </div>
    </section>
  );
}
