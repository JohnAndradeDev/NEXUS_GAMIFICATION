export function ActivityTimeline() {
  return (
    <section className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-4 shadow-md backdrop-blur-md sm:p-space-lg">
      <div>
        <div className="mb-space-md flex items-center justify-between border-b border-surface-container-highest/60 pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-xl text-secondary">
              history_toggle_off
            </span>

            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Atividades Recentes
              </h3>
              <p className="font-body-sm text-body-sm text-outline">
                Fluxo de conquistas e marcos do time
              </p>
            </div>
          </div>

          <span className="material-symbols-outlined cursor-pointer text-outline hover:text-on-surface">
            tune
          </span>
        </div>

        <div className="relative flex flex-col gap-space-md overflow-hidden pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-surface-container-highest before:content-['']">
          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-tertiary text-surface-container-lowest shadow-[0_0_10px_rgba(78,222,163,0.5)]">
              <span className="material-symbols-outlined text-xs font-bold">
                check
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface">
                Lucas Mendes
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Há 12 min
              </span>
            </div>

            <p className="break-words font-body-md text-body-md text-on-surface-variant">
              Concluiu a tarefa{" "}
              <strong className="text-on-surface">
                "Configuração do pipeline CI/CD"
              </strong>
            </p>

            <div className="mt-0.5 flex flex-wrap items-center gap-space-xs">
              <span className="rounded bg-tertiary/10 px-space-xs py-0.5 font-label-sm text-label-sm text-tertiary-fixed-dim">
                +15 pts Squad
              </span>
              <span className="rounded bg-primary/10 px-space-xs py-0.5 font-label-sm text-label-sm text-primary">
                +100 XP
              </span>
            </div>
          </div>

          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container shadow-[0_0_10px_rgba(87,27,193,0.6)]">
              <span className="material-symbols-outlined text-xs">shield</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface">
                Beatriz Lima
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Há 45 min
              </span>
            </div>

            <p className="break-words font-body-md text-body-md text-on-surface-variant">
              Desbloqueou a insígnia lendária{" "}
              <strong className="font-semibold text-secondary">
                "Guardiã do Código Limpo"
              </strong>
            </p>

            <span className="mt-0.5 inline-flex w-fit items-center gap-1 rounded bg-secondary-container/50 px-space-xs py-0.5 font-label-sm text-label-sm text-secondary-fixed">
              <span className="material-symbols-outlined text-xs">
                military_tech
              </span>
              Badge Rara
            </span>
          </div>

          <div className="relative -ml-2 flex flex-col gap-1 rounded-xl bg-surface-container/60 p-space-sm">
            <div className="absolute -left-4 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-error text-on-error shadow-[0_0_12px_rgba(255,180,171,0.5)]">
              <span className="material-symbols-outlined text-xs font-bold">
                local_fire_department
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 font-headline-sm text-headline-sm text-primary">
                Subida de Posição! 🔥
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Há 2h
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface">
              O Squad <strong>CyberTitans</strong> subiu para a{" "}
              <strong className="text-tertiary-fixed-dim">2ª posição</strong>{" "}
              geral!
            </p>

            <span className="font-label-sm text-label-sm text-outline">
              Ultrapassou o CloudWarriors por 570 pts
            </span>
          </div>

          <div className="relative flex flex-col gap-1">
            <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-on-primary shadow-[0_0_10px_rgba(76,215,246,0.6)]">
              <span className="material-symbols-outlined text-xs font-bold">
                flag
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-label-md text-label-md text-on-surface">
                Meta Coletiva
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Há 4h
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Meta de{" "}
              <strong className="text-on-surface">
                80% do sprint concluído
              </strong>{" "}
              atingida antecipadamente pelo squad.
            </p>

            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className="h-full w-[88.8%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>

      <button className="mt-space-md flex w-full items-center justify-center gap-1.5 rounded-xl bg-surface-container py-2 font-label-md text-label-md text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface">
        <span className="material-symbols-outlined text-base">forum</span>
        Publicar no Mural do Squad
      </button>
    </section>
  );
}
