interface MobileBottomNavProps {
  activePage: "user" | "manager" | "squad" | "admin";
}

export function MobileBottomNav({ activePage }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-surface-container-high bg-surface-container-lowest/95 px-1 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.4)] backdrop-blur-xl lg:hidden">
      <a
        href="#"
        className={[
          "flex flex-1 flex-col items-center justify-center py-1 transition-colors",
          activePage === "user"
            ? "font-semibold text-primary"
            : "text-on-surface-variant hover:text-on-surface",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-xl">dashboard</span>
        <span className="mt-0.5 font-label-sm text-[10px]">Usuário</span>
      </a>

      <a
        href="#"
        className={[
          "flex flex-1 flex-col items-center justify-center py-1 transition-colors",
          activePage === "manager"
            ? "font-semibold text-primary"
            : "text-on-surface-variant hover:text-on-surface",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-xl">
          supervisor_account
        </span>
        <span className="mt-0.5 font-label-sm text-[10px]">Gestor</span>
      </a>

      <a
        href="#"
        className={[
          "flex flex-1 flex-col items-center justify-center py-1 transition-colors",
          activePage === "squad"
            ? "font-semibold text-primary"
            : "text-on-surface-variant hover:text-on-surface",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-xl">shield_person</span>
        <span className="mt-0.5 font-label-sm text-[10px]">Squad</span>
      </a>

      <a
        href="#"
        className={[
          "flex flex-1 flex-col items-center justify-center py-1 transition-colors",
          activePage === "admin"
            ? "font-semibold text-primary"
            : "text-on-surface-variant hover:text-on-surface",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-xl">
          admin_panel_settings
        </span>
        <span className="mt-0.5 font-label-sm text-[10px]">Admin</span>
      </a>

      <a
        href="#"
        className="flex flex-1 flex-col items-center justify-center py-1 text-error"
      >
        <span className="material-symbols-outlined text-xl">logout</span>
        <span className="mt-0.5 font-label-sm text-[10px]">Sair</span>
      </a>
    </nav>
  );
}
