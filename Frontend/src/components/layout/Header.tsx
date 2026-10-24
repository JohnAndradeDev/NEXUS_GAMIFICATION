export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between bg-surface-container-lowest/80 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:px-gutter lg:left-72 lg:h-20">
      <div className="flex min-w-0 items-center gap-2 sm:gap-space-md">
        <div className="flex min-w-0 items-center gap-space-xs rounded-full bg-surface-container px-2.5 py-1 shadow-[0_0_12px_rgba(6,182,212,0.15)] sm:px-space-md sm:py-space-xs">
          <span className="material-symbols-outlined shrink-0 text-base text-primary sm:text-lg">
            shield
          </span>

          <span className="truncate font-label-md text-label-md text-on-surface sm:font-label-lg sm:text-label-lg">
            CyberTitans{" "}
            <span className="hidden font-body-sm font-normal text-outline sm:inline">
              (Engenharia)
            </span>
          </span>
        </div>

        <div className="hidden items-center gap-1.5 overflow-x-auto py-1 md:flex lg:gap-space-sm">
          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-container-low px-2 py-1 sm:px-space-sm sm:py-space-xs">
            <span className="material-symbols-outlined text-sm text-primary sm:text-base">
              bolt
            </span>
            <span className="font-label-sm text-label-sm text-on-surface sm:font-label-md sm:text-label-md">
              2.450 <span className="text-outline">XP</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-container-low px-2 py-1 sm:px-space-sm sm:py-space-xs">
            <span className="material-symbols-outlined text-sm text-tertiary sm:text-base">
              toll
            </span>
            <span className="font-label-sm text-label-sm text-on-surface sm:font-label-md sm:text-label-md">
              850 <span className="text-outline">SQ</span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-container-low px-2 py-1 sm:px-space-sm sm:py-space-xs">
            <span className="material-symbols-outlined animate-pulse text-sm text-error sm:text-base">
              local_fire_department
            </span>
            <span className="font-label-sm text-label-sm text-on-surface sm:font-label-md sm:text-label-md">
              12D <span className="hidden text-outline xl:inline">Streak</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-space-md lg:gap-space-lg">
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-all hover:bg-surface-container-high hover:text-on-surface sm:h-10 sm:w-10">
          <span className="material-symbols-outlined text-lg sm:text-xl">
            notifications
          </span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-surface-container-lowest" />
        </button>

        <div className="flex items-center gap-1.5 rounded-xl bg-surface-container-low px-1.5 py-1 sm:gap-space-sm sm:px-space-sm sm:py-space-xs">
          <div className="relative shrink-0">
            <img
              alt="Perfil de João Silveira"
              className="h-7 w-7 rounded-full object-cover sm:h-8 sm:w-8"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzi-y7ORvXzf14RB8S3h-BJpabkJey6hWOwAUR0GxHH4z5One8p3s9zVLUslbH-PYlkWkXo76VlBv54xRSoP5hNd7aesx8o7pvM3zORIzdUnRstteB5u2EgcH3ePz-GJ4iAcHSZO3k9QBnpwHaE6zGkVaWtCSZqkaMVz3V-LBXSFnIWOJkUlQRhTIMcLALheS2ekIA9-NcLEZf7Ft-12zGzGa62m-pXMswUs4xv5Ci4TSdpNYJF0xH"
            />
            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-tertiary ring-2 ring-surface-container-low sm:h-2.5 sm:w-2.5" />
          </div>

          <div className="hidden flex-col text-left sm:flex">
            <span className="font-label-md text-label-md leading-tight text-on-surface">
              João Silveira
            </span>
            <span className="font-label-sm text-label-sm leading-none text-primary-fixed-dim">
              Nível 14 • Mestre
            </span>
          </div>

          <span className="material-symbols-outlined hidden text-sm text-outline sm:inline">
            expand_more
          </span>
        </div>
      </div>
    </header>
  );
}
