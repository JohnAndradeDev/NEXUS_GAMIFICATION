export function IndividualTasks() {
  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-space-lg shadow-lg">
      <div className="mb-space-md flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-primary" />
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            Minhas Tarefas Individuais
          </h2>
        </div>

        <span className="rounded-full bg-surface-container-highest px-space-xs py-0.5 font-label-sm text-label-sm text-primary">
          Todas (3)
        </span>
      </div>

      <div className="flex flex-col gap-space-sm">
        {/* Tarefa 1 */}
        <div className="group flex flex-col gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-start gap-space-sm">
            <label className="relative mt-1 flex cursor-pointer items-center justify-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-container-highest transition-colors peer-checked:bg-tertiary peer-checked:text-on-tertiary">
                <span className="material-symbols-outlined text-sm font-bold opacity-0 transition-opacity peer-checked:opacity-100">
                  check
                </span>
              </div>
            </label>

            <div className="flex flex-col">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-primary">
                  Backend
                </span>
                <span className="rounded-full bg-error-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-error-container">
                  Difícil
                </span>
                <span className="flex items-center gap-0.5 rounded-full bg-primary-container/20 px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary-fixed">
                  <span className="material-symbols-outlined text-xs">
                    bolt
                  </span>
                  +15 pts
                </span>
              </div>

              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                Implementar autenticação OAuth2 SSO
              </h3>

              <div className="mt-1 flex items-center gap-space-md font-body-sm text-body-sm text-outline">
                <span className="flex items-center gap-1 text-primary">
                  <span className="material-symbols-outlined text-xs">
                    schedule
                  </span>
                  Prazo: Hoje, 18:00
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-ping rounded-full bg-primary-container" />
                  Em andamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarefa 2 */}
        <div className="group flex flex-col gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:shadow-[0_0_20px_rgba(78,222,163,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-start gap-space-sm">
            <label className="relative mt-1 flex cursor-pointer items-center justify-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-container-highest transition-colors peer-checked:bg-tertiary peer-checked:text-on-tertiary">
                <span className="material-symbols-outlined text-sm font-bold opacity-0 transition-opacity peer-checked:opacity-100">
                  check
                </span>
              </div>
            </label>

            <div className="flex flex-col">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-secondary-fixed">
                  Code Review
                </span>
                <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-surface-variant">
                  Médio
                </span>
                <span className="flex items-center gap-0.5 rounded-full bg-primary-container/20 px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary-fixed">
                  <span className="material-symbols-outlined text-xs">
                    bolt
                  </span>
                  +10 pts
                </span>
              </div>

              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                Revisar PRs do módulo de telemetria
              </h3>

              <div className="mt-1 flex items-center gap-space-md font-body-sm text-body-sm text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    event
                  </span>
                  Prazo: Amanhã
                </span>
                <span className="flex items-center gap-1 text-outline">
                  <span className="h-2 w-2 rounded-full bg-outline" />
                  Pendente
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarefa 3 */}
        <div className="group flex flex-col gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:shadow-[0_0_20px_rgba(78,222,163,0.1)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-start gap-space-sm">
            <label className="relative mt-1 flex cursor-pointer items-center justify-center">
              <input type="checkbox" className="peer sr-only" />
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-surface-container-highest transition-colors peer-checked:bg-tertiary peer-checked:text-on-tertiary">
                <span className="material-symbols-outlined text-sm font-bold opacity-0 transition-opacity peer-checked:opacity-100">
                  check
                </span>
              </div>
            </label>

            <div className="flex flex-col">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-tertiary">
                  Docs
                </span>
                <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-tertiary-fixed">
                  Fácil
                </span>
                <span className="flex items-center gap-0.5 rounded-full bg-primary-container/20 px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary-fixed">
                  <span className="material-symbols-outlined text-xs">
                    bolt
                  </span>
                  +5 pts
                </span>
              </div>

              <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                Escrever documentação técnica da API NEXUS
              </h3>

              <div className="mt-1 flex items-center gap-space-md font-body-sm text-body-sm text-outline">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">
                    event
                  </span>
                  Prazo: Sexta-feira
                </span>
                <span className="flex items-center gap-1 text-outline">
                  <span className="h-2 w-2 rounded-full bg-outline" />
                  Pendente
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
