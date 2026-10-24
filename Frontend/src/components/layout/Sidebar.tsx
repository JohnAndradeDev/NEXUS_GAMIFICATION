type ActivePage = "user" | "manager" | "squad" | "admin";

interface SidebarProps {
  activePage: ActivePage;
}

export function Sidebar({ activePage }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-full w-72 flex-col justify-between bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.3)] transition-all duration-300 lg:flex">
      <div className="flex flex-1 flex-col overflow-y-auto px-space-md pt-space-lg">
        <div className="mb-space-xl flex items-center gap-space-sm px-space-sm">
          <div className="flex flex-col">
            <span className="bg-linear-to-r from-primary-fixed via-primary to-secondary bg-clip-text text-2xl tracking-tight text-transparent">
              NEXUS
            </span>

            <span className="mt-space-xs font-label-sm text-label-sm uppercase tracking-wider text-primary">
              Enterprise Gamification
            </span>
          </div>
        </div>

        <div className="mb-space-xs px-space-sm">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Navegação Principal
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-space-xs">
          <a
            href="/user"
            className={[
              "flex items-center rounded-lg px-space-md py-space-sm transition-all",
              activePage === "user"
                ? "bg-primary-container font-headline-sm text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            ].join(" ")}
          >
            <span className="material-symbols-outlined shrink-0 text-xl">
              dashboard
            </span>
            <span className="ml-space-sm font-label-lg text-label-lg">
              Dashboard (Usuário)
            </span>
          </a>

          <a
            href="/manager"
            className={[
              "flex items-center rounded-lg px-space-md py-space-sm transition-all",
              activePage === "manager"
                ? "bg-primary-container font-headline-sm text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            ].join(" ")}
          >
            <span className="material-symbols-outlined shrink-0 text-xl">
              supervisor_account
            </span>
            <span className="ml-space-sm font-label-lg text-label-lg">
              Dashboard do Gestor
            </span>
          </a>

          <a
            href="/manage-squad"
            className={[
              "flex items-center rounded-lg px-space-md py-space-sm transition-all",
              activePage === "squad"
                ? "bg-primary-container font-headline-sm text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            ].join(" ")}
          >
            <span className="material-symbols-outlined shrink-0 text-xl">
              shield_person
            </span>
            <span className="ml-space-sm font-label-lg text-label-lg">
              Gerenciar Squad
            </span>
          </a>

          <a
            href="/admin"
            className={[
              "flex items-center rounded-lg px-space-md py-space-sm transition-all",
              activePage === "admin"
                ? "bg-primary-container font-headline-sm text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.3)]"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            ].join(" ")}
          >
            <span className="material-symbols-outlined shrink-0 text-xl">
              admin_panel_settings
            </span>
            <span className="ml-space-sm font-label-lg text-label-lg">
              Painel Admin
            </span>
          </a>
        </nav>
      </div>

      <div className="mx-space-md mb-4 border-t border-outline-variant/30 pt-space-md">
        <a
          href="/"
          className="flex items-center rounded-lg px-space-md py-space-sm text-error transition-all hover:bg-error/10"
        >
          <span className="material-symbols-outlined shrink-0 text-xl">
            logout
          </span>
          <span className="ml-space-sm font-label-lg text-label-lg">
            Sair / Login
          </span>
        </a>
      </div>
    </aside>
  );
}
