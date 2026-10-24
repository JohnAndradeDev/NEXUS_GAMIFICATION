interface ManagerHeaderProps {
  name: string;
  description: string | null;
}

export function ManagerHeader({ name, description }: ManagerHeaderProps) {
  return (
    <section className="relative mb-space-lg overflow-hidden py-4 sm:py-space-lg">
      <div className="pointer-events-none absolute -left-10 -top-10 -z-10 h-56 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-0 -z-10 h-48 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-space-lg">
        <div className="flex min-w-0 flex-col">
          <h1 className="flex flex-wrap items-center gap-2 font-headline-lg text-xl tracking-tight text-on-surface sm:gap-space-sm sm:font-headline-xl sm:text-headline-xl">
            <span>Squad {name}</span>
          </h1>

          <p className="mt-1 max-w-2xl font-body-md text-body-md text-on-surface-variant">
            {description ??
              "Monitoramento de objetivos, distribuição de missões, pontuação e cadência de entregas do squad."}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            document
              .getElementById("squad-task-form")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="flex w-full shrink-0 items-center justify-center gap-space-xs rounded-xl bg-primary px-space-md py-2.5 font-label-lg text-label-lg text-on-primary shadow-[0_0_20px_rgba(76,215,246,0.35)] transition-all hover:shadow-[0_0_28px_rgba(76,215,246,0.55)] sm:w-auto"
        >
          <span className="material-symbols-outlined text-lg">add_task</span>
          Nova Tarefa de Squad
        </button>
      </div>
    </section>
  );
}
