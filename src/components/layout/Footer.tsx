export function Footer() {
  return (
    <footer className="w-full border-t border-surface-container-highest/40 bg-surface-container-lowest px-4 py-space-md sm:px-gutter">
      <div className="flex w-full flex-col items-center justify-between gap-space-xs text-center font-body-sm text-body-sm text-outline md:flex-row md:text-left">
        <p>NEXUS © 2025 • Sistema Corporativo de Gamificação e Performance</p>

        <div className="flex items-center gap-space-md">
          <span className="flex items-center gap-1.5 text-tertiary">
            <span className="h-1.5 w-1.5 animate-ping rounded-full bg-tertiary" />
            Servidores Operacionais
          </span>
          <span>v2.8.4-ent</span>
        </div>
      </div>
    </footer>
  );
}
