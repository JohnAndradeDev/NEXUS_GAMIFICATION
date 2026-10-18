export function RecentAchievements() {
  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-space-lg shadow-lg">
      <div className="mb-space-md flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-secondary-fixed-dim" />
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Conquistas Recentes
          </h2>
        </div>

        <span className="font-label-sm text-label-sm text-outline">
          5 Desbloqueadas
        </span>
      </div>

      <div className="grid grid-cols-5 gap-space-xs sm:gap-space-sm">
        {/* Badge 1 */}
        <div className="group relative flex flex-col items-center">
          <div className="h-12 w-12 cursor-pointer rounded-2xl bg-surface-container shadow-md transition-all group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(76,215,246,0.5)] sm:h-14 sm:w-14">
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-primary">
                flag
              </span>
            </div>
          </div>
          <span className="mt-1 w-full truncate text-center font-label-sm text-label-sm text-outline group-hover:text-on-surface">
            Pioneiro
          </span>

          <div className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="font-label-sm text-label-sm font-bold">
              Primeira Missão
            </p>
            <p className="font-body-sm text-[10px] text-outline">
              Conquistada em 12/01
            </p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="group relative flex flex-col items-center">
          <div className="h-12 w-12 cursor-pointer rounded-2xl bg-surface-container shadow-md transition-all group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(255,180,171,0.5)] sm:h-14 sm:w-14">
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined animate-pulse text-2xl text-error">
                local_fire_department
              </span>
            </div>
          </div>
          <span className="mt-1 w-full truncate text-center font-label-sm text-label-sm text-outline group-hover:text-on-surface">
            7D Streak
          </span>

          <div className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="font-label-sm text-label-sm font-bold">
              Sequência de 7 Dias
            </p>
            <p className="font-body-sm text-[10px] text-outline">
              Conquistada em 02/02
            </p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="group relative flex flex-col items-center">
          <div className="h-12 w-12 cursor-pointer rounded-2xl bg-surface-container shadow-md transition-all group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(245,158,11,0.5)] sm:h-14 sm:w-14">
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-[#F59E0B]">
                workspace_premium
              </span>
            </div>
          </div>
          <span className="mt-1 w-full truncate text-center font-label-sm text-label-sm text-outline group-hover:text-on-surface">
            Top 3
          </span>

          <div className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="font-label-sm text-label-sm font-bold">
              Top 3 do Ranking
            </p>
            <p className="font-body-sm text-[10px] text-outline">
              Conquistada em 18/02
            </p>
          </div>
        </div>

        {/* Badge 4 */}
        <div className="group relative flex flex-col items-center">
          <div className="h-12 w-12 cursor-pointer rounded-2xl bg-surface-container shadow-md transition-all group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(208,188,255,0.5)] sm:h-14 sm:w-14">
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-secondary">
                diversity_3
              </span>
            </div>
          </div>
          <span className="mt-1 w-full truncate text-center font-label-sm text-label-sm text-outline group-hover:text-on-surface">
            Equipe
          </span>

          <div className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="font-label-sm text-label-sm font-bold">
              Trabalho em Equipe
            </p>
            <p className="font-body-sm text-[10px] text-outline">
              Conquistada em 25/02
            </p>
          </div>
        </div>

        {/* Badge 5 */}
        <div className="group relative flex flex-col items-center">
          <div className="h-12 w-12 cursor-pointer rounded-2xl bg-surface-container shadow-md transition-all group-hover:scale-110 group-hover:shadow-[0_0_16px_rgba(78,222,163,0.5)] sm:h-14 sm:w-14">
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-tertiary">
                verified
              </span>
            </div>
          </div>
          <span className="mt-1 w-full truncate text-center font-label-sm text-label-sm text-outline group-hover:text-on-surface">
            Meta Batida
          </span>

          <div className="pointer-events-none absolute -top-12 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            <p className="font-label-sm text-label-sm font-bold">
              Meta Semanal Batida
            </p>
            <p className="font-body-sm text-[10px] text-outline">
              Conquistada Ontem
            </p>
          </div>
        </div>
      </div>

      <div className="mt-space-md flex items-center justify-between rounded-xl bg-linear-to-r from-surface-container to-surface-container-high p-space-md shadow-inner">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
            <span className="material-symbols-outlined text-xl">lock_open</span>
          </div>

          <div className="flex flex-col">
            <span className="font-label-md text-label-md font-bold text-on-surface">
              Próximo Badge: Mestre da Nuvem
            </span>
            <span className="font-body-sm text-body-sm text-outline">
              Complete mais 2 missões de infra
            </span>
          </div>
        </div>

        <span className="font-label-sm text-label-sm font-bold text-primary">
          85%
        </span>
      </div>
    </section>
  );
}
