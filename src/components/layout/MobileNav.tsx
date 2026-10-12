export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-outline-variant/30 bg-surface-container-lowest/95 px-space-sm py-space-xs shadow-2xl backdrop-blur-xl lg:hidden">
      <a className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-primary">
        <span className="material-symbols-outlined text-xl">dashboard</span>
        <span className="font-label-sm text-[10px]">Dashboard</span>
      </a>

      <a className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-on-surface-variant transition-all hover:text-on-surface">
        <span className="material-symbols-outlined text-xl">leaderboard</span>
        <span className="font-label-sm text-[10px]">Gestor</span>
      </a>

      <a className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-on-surface-variant transition-all hover:text-on-surface">
        <span className="material-symbols-outlined text-xl">shield_person</span>
        <span className="font-label-sm text-[10px]">Squad</span>
      </a>

      <a className="flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-on-surface-variant transition-all hover:text-on-surface">
        <span className="material-symbols-outlined text-xl">
          admin_panel_settings
        </span>
        <span className="font-label-sm text-[10px]">Admin</span>
      </a>
    </nav>
  );
}
