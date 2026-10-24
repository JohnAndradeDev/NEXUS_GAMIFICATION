export function SquadRanking() {
  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-space-lg shadow-lg">
      <div className="mb-space-md flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-tertiary" />
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Ranking dos Squads
          </h2>
        </div>

        <span className="flex items-center gap-1 rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-tertiary">
          <span className="material-symbols-outlined text-xs">trending_up</span>
          Sprint 42
        </span>
      </div>

      <div className="flex flex-col gap-space-xs">
        {/* 1º Lugar */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container p-space-sm shadow-sm transition-colors hover:bg-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-sm font-bold text-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              1º
            </div>

            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold leading-tight text-on-surface">
                DevCommanders
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Engenharia Core
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-label-lg text-label-lg font-extrabold text-on-surface">
              14.890 <span className="font-body-sm text-outline">pts</span>
            </span>
            <span className="flex items-center gap-0.5 font-body-sm text-body-sm text-tertiary">
              <span className="material-symbols-outlined text-xs">
                arrow_upward
              </span>
              Mantém liderança
            </span>
          </div>
        </div>

        {/* 2º Lugar - Seu Squad */}
        <div className="flex items-center justify-between rounded-xl bg-primary/10 p-space-sm shadow-[0_0_16px_rgba(6,182,212,0.2)]">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-sm font-bold">
              2º
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm font-bold leading-tight text-primary">
                  CyberTitans
                </span>
                <span className="rounded bg-primary px-1.5 py-0.5 font-label-sm text-label-sm text-[9px] font-extrabold uppercase text-on-primary">
                  Seu Squad
                </span>
              </div>
              <span className="font-body-sm text-body-sm text-outline">
                Infra & Plataforma
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-label-lg text-label-lg font-extrabold text-primary">
              13.420 <span className="font-body-sm text-outline">pts</span>
            </span>
            <span className="flex items-center gap-0.5 font-body-sm text-body-sm font-bold text-tertiary">
              <span className="material-symbols-outlined text-xs">
                arrow_upward
              </span>
              +2 posições
            </span>
          </div>
        </div>

        {/* 3º Lugar */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container p-space-sm shadow-sm transition-colors hover:bg-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-sm font-bold text-[#B45309]">
              3º
            </div>

            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold leading-tight text-on-surface">
                CloudWarriors
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                DevOps & Cloud
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-label-lg text-label-lg font-extrabold text-on-surface">
              11.200 <span className="font-body-sm text-outline">pts</span>
            </span>
            <span className="flex items-center gap-0.5 font-body-sm text-body-sm text-outline">
              <span className="material-symbols-outlined text-xs">
                horizontal_rule
              </span>
              Estável
            </span>
          </div>
        </div>

        {/* 4º Lugar */}
        <div className="flex items-center justify-between rounded-xl bg-surface-container p-space-sm shadow-sm transition-colors hover:bg-surface-container-high">
          <div className="flex items-center gap-space-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest text-sm font-bold text-outline">
              4º
            </div>

            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm font-bold leading-tight text-on-surface">
                UXGuardians
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Design & Front
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="font-label-lg text-label-lg font-extrabold text-on-surface">
              9.850 <span className="font-body-sm text-outline">pts</span>
            </span>
            <span className="flex items-center gap-0.5 font-body-sm text-body-sm text-error">
              <span className="material-symbols-outlined text-xs">
                arrow_downward
              </span>
              -1 posição
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
