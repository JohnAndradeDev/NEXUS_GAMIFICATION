import type { SquadOverview } from "../../lib/squads";

export function SquadOverviewHeader({ data }: { data: SquadOverview }) {
  const { squad, stats } = data;

  return (
    <section className="relative mb-space-lg overflow-hidden rounded-2xl bg-surface-container-low p-4 shadow-xl sm:p-space-md md:p-space-xl">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative flex flex-col items-start justify-between gap-space-lg lg:flex-row lg:items-center">
        <div className="flex w-full flex-col items-start gap-space-lg sm:flex-row sm:items-center lg:w-auto">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-surface-container-high shadow-lg sm:h-28 sm:w-28">
            <div className="absolute inset-0 bg-linear-to-tr from-primary/20 via-transparent to-secondary/20" />
            <span className="material-symbols-outlined relative text-5xl text-primary drop-shadow-[0_0_12px_rgba(76,215,246,0.5)] sm:text-6xl">
              shield_locked
            </span>
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="mb-space-xs flex flex-wrap items-center gap-space-xs">
              <span className="flex items-center gap-1 rounded-md bg-amber-500/15 px-space-sm py-0.5 font-label-sm text-label-sm text-amber-300 shadow-sm">
                <span className="material-symbols-outlined text-sm">trophy</span>#
                {stats.rank} no Ranking
              </span>

              <span className="rounded-md bg-surface-container-highest px-space-sm py-0.5 font-label-sm text-label-sm text-on-surface-variant">
                {stats.memberCount}{" "}
                {stats.memberCount === 1 ? "Integrante Ativo" : "Integrantes Ativos"}
              </span>

              {squad.manager && (
                <span className="rounded-md bg-secondary/15 px-space-sm py-0.5 font-label-sm text-label-sm text-secondary">
                  Gestor: {squad.manager.name}
                </span>
              )}
            </div>

            <h1 className="flex items-center gap-space-sm font-headline-xl text-2xl tracking-tight text-on-surface sm:text-headline-xl">
              <span className="truncate">{squad.name}</span>
              <span className="material-symbols-outlined shrink-0 text-2xl text-primary">
                verified
              </span>
            </h1>

            <p className="mt-space-xs max-w-2xl font-body-md text-body-md text-on-surface-variant">
              {squad.description ?? "Este squad ainda não tem uma descrição."}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-row items-center justify-between gap-space-sm rounded-xl bg-surface-container/60 p-space-md backdrop-blur-md lg:w-auto lg:flex-col lg:items-end">
          <div className="flex flex-col text-left lg:text-right">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Missões em aberto
            </span>
            <span className="flex items-center gap-1.5 font-label-lg text-label-lg text-tertiary lg:justify-end">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              {stats.tasksOpen}{" "}
              {stats.tasksOpen === 1 ? "missão ativa" : "missões ativas"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
