export function DashboardHero() {
  return (
    <section className="relative mb-space-lg overflow-hidden rounded-xl bg-surface-container-low p-space-lg shadow-xl">
      <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-start gap-space-lg xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-space-md md:items-center">
          <div className="relative shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-surface-container shadow-[0_0_24px_rgba(6,182,212,0.35)] md:h-24 md:w-24">
              <img
                alt="Foto de João Silveira"
                className="h-full w-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRgLNEDlYF6GD4ZrE4RDJm3mJ0QEU8tRc9IyWW1QHlsO2Q7nTqc0oJ1t51Kt0736sAr8ukDNAIzUEYvlW7elczYcR626cO2O6cXUawshNSQ6hUwkw8QtSvp5acBh9hSbzxYrwtKoKzItl4UIWUhnL14qk86LyBaTKgv-__cXrLiEcfQAe02ZY7g1VOAO2q0QROLFuHq5aiVHUH0gYvQDB7ypW9990CUtd8fPGtc6Xp3eSiJ_5c30M-"
              />
            </div>

            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary shadow-md">
              <span className="material-symbols-outlined text-xs">
                military_tech
              </span>
              LVL 14
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-1 flex flex-wrap items-center gap-space-xs">
              <span className="rounded-full bg-secondary-container px-space-xs py-0.5 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-secondary-container">
                Tech Pathfinder
              </span>

              <span className="flex items-center gap-1 rounded-full bg-tertiary/15 px-space-xs py-0.5 font-label-sm text-label-sm font-semibold text-tertiary">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
                Em Operação
              </span>
            </div>

            <h1 className="font-headline-lg text-headline-lg font-bold tracking-tight text-on-surface">
              Olá, João Silveira! Pronto para completar suas missões de hoje?
            </h1>

            <p className="mt-0.5 font-body-md text-body-md text-outline">
              Sua disciplina eleva o esquadrão{" "}
              <span className="font-semibold text-primary">CyberTitans</span> ao
              topo do ranking corporativo.
            </p>
          </div>
        </div>

        <div className="w-full rounded-xl bg-surface-container p-space-md shadow-inner xl:w-96">
          <div className="mb-2 flex items-center justify-between font-label-md text-label-md">
            <span className="flex items-center gap-1 font-semibold text-on-surface">
              <span className="material-symbols-outlined text-base text-primary">
                upgrade
              </span>
              Progresso do Nível
            </span>

            <span className="font-bold text-primary-fixed-dim">74%</span>
          </div>

          <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary-container via-primary to-tertiary shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-1000"
              style={{ width: "74%" }}
            />
          </div>

          <div className="flex items-center justify-between font-body-sm text-body-sm text-outline">
            <span>1.850 / 2.500 XP</span>

            <span className="font-medium text-on-surface-variant">
              Faltam <strong className="text-primary">650 XP</strong> para o Nvl
              15
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
