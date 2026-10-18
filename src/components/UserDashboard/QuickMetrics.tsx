export function QuickMetrics() {
  return (
    <div className="mb-space-lg  grid grid-cols-1 gap-space-md border-t-0 pt-space-md sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:bg-surface-container-high">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-[0_0_16px_rgba(76,215,246,0.25)]">
          <span className="material-symbols-outlined text-2xl">toll</span>
        </div>

        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm text-outline">
            Total de Pontos
          </span>

          <div className="flex items-baseline gap-1">
            <span className="font-metric-display text-metric-display font-extrabold text-on-surface">
              3.420
            </span>
            <span className="font-label-sm text-label-sm font-bold text-primary">
              pts
            </span>
          </div>

          <span className="font-body-sm text-body-sm text-tertiary">
            <span className="material-symbols-outlined text-xs">
              trending_up
            </span>{" "}
            +180 esta semana
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:bg-surface-container-high">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error shadow-[0_0_16px_rgba(255,180,171,0.2)]">
          <span className="material-symbols-outlined animate-pulse text-2xl">
            local_fire_department
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm text-outline">
            Sequência Ativa
          </span>

          <div className="flex items-baseline gap-1">
            <span className="font-metric-display text-metric-display font-extrabold text-on-surface">
              12
            </span>
            <span className="font-label-sm text-label-sm font-bold text-on-surface">
              Dias
            </span>
          </div>

          <span className="font-body-sm text-body-sm text-secondary-fixed-dim">
            Bônus de +15% XP ativo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:bg-surface-container-high">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary shadow-[0_0_16px_rgba(78,222,163,0.2)]">
          <span className="material-symbols-outlined text-2xl">task_alt</span>
        </div>

        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm text-outline">
            Missões Concluídas
          </span>

          <div className="flex items-baseline gap-1">
            <span className="font-metric-display text-metric-display font-extrabold text-on-surface">
              38
            </span>
            <span className="font-label-sm text-label-sm font-normal text-outline">
              / 45 no ciclo
            </span>
          </div>

          <span className="font-body-sm text-body-sm text-primary">
            Taxa de entrega: 84.4%
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:bg-surface-container-high">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary-container/30 text-secondary shadow-[0_0_16px_rgba(208,188,255,0.2)]">
          <span className="material-symbols-outlined text-2xl">trophy</span>
        </div>

        <div className="flex flex-col">
          <span className="font-body-sm text-body-sm text-outline">
            Posição no Ranking
          </span>

          <div className="flex items-baseline gap-1">
            <span className="font-metric-display text-metric-display font-extrabold text-on-surface">
              #3
            </span>
            <span className="font-label-sm text-label-sm font-bold text-secondary">
              no Squad
            </span>
          </div>

          <span className="font-body-sm text-body-sm text-outline-variant">
            #12 na Empresa global
          </span>
        </div>
      </div>
    </div>
  );
}
