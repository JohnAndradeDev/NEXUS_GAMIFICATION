import { useEffect, useRef } from "react";
import { Drone404 } from "../components/NotFound/Drone404";
import "../styles/notFound.css";

export function NotFound() {
  const reconnectBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const btn = reconnectBtnRef.current;
    if (!btn) return;

    const icon = btn.querySelector("#reconnectIcon") as HTMLElement | null;
    const label = btn.querySelector("#reconnectLabel") as HTMLElement | null;

    function handleClick() {
      const currentBtn = btn;
      const currentIcon = icon;
      const currentLabel = label;

      if (!currentBtn || !currentIcon || !currentLabel) return;

      currentIcon.classList.add("animate-spin");
      currentLabel.textContent = "Buscando sinal...";
      currentBtn.disabled = true;

      setTimeout(() => {
        if (!currentBtn || !currentIcon || !currentLabel) return;

        currentIcon.classList.remove("animate-spin");
        currentIcon.textContent = "warning";
        currentIcon.classList.remove("text-primary");
        currentIcon.classList.add("text-error");
        currentLabel.textContent = "Setor indisponível";

        setTimeout(() => {
          if (!currentBtn || !currentIcon || !currentLabel) return;

          currentIcon.textContent = "sync";
          currentIcon.classList.add("text-primary");
          currentIcon.classList.remove("text-error");
          currentLabel.textContent = "Tentar Reconectar";
          currentBtn.disabled = false;
        }, 3000);
      }, 1500);
    }

    btn.addEventListener("click", handleClick);

    return () => {
      btn.removeEventListener("click", handleClick);
    };
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full px-gutter bg-background">
        <div className="flex flex-col w-full">
          <div className="relative w-full max-w-5xl mx-auto py-space-xl flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="flex items-center gap-space-sm mb-space-lg">
              <img
                alt="NEXUS Logo"
                className="h-8 w-auto object-contain rounded-md"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAll1Fv4wFMoKsOOzlgbaWL2NDJaErQhE0024_PVBdvKjtYoNyd0mHMjmyiO4jmoeYa_Ucje0K_kmfAwNRPuwiSTpc9Q36BtPujqiqWBrdWh7ru7a0xu5LqMrm0zvstok8MmVV4d1vrdmw3Rf_SDzEKj1dJJLs9TaLOmA_jNwr6bLH-3J7g4vU9Ai7JhefXrYNM9OyniLXemwiTLFPuI7TZmCppVFeR7ebirBzhqWrtaMsPprg4Ej97"
              />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight leading-none">
                  NEXUS
                </span>
                <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider mt-space-xs">
                  Enterprise Gamification
                </span>
              </div>
            </div>

            {/* Ambient Radial Glows */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-1/3 -right-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute bottom-10 -left-20 w-72 h-72 bg-error-container/15 rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Holographic Sector Tag */}
            <div className="inline-flex items-center gap-space-sm px-space-md py-space-xs rounded-full bg-surface-container-high/80 backdrop-blur-md shadow-md mb-space-lg">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-error" />
              </span>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-error">
                Status: Setor Não Mapeado
              </span>
              <span className="text-outline-variant font-label-sm">|</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-mono">
                CÓDIGO #404-NX
              </span>
            </div>

            {/* Centered Animated Drone / Scanner Graphic */}
            <div className="relative w-full max-w-xl mx-auto flex items-center justify-center">
              <Drone404 />

              {/* Telemetry Overlays */}
              <div className="absolute top-2 left-4 hidden sm:flex items-center gap-1.5 px-space-sm py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm shadow-md">
                <span className="material-symbols-outlined text-xs text-primary animate-pulse">
                  radar
                </span>
                <span className="font-label-sm text-[10px] text-primary tracking-wider uppercase font-mono">
                  SCAN: NULL_NODE
                </span>
              </div>
              <div className="absolute bottom-4 right-4 hidden sm:flex items-center gap-1.5 px-space-sm py-1 rounded-md bg-surface-container-lowest/90 backdrop-blur-sm shadow-md">
                <span className="material-symbols-outlined text-xs text-secondary">
                  satellite_alt
                </span>
                <span className="font-label-sm text-[10px] text-on-surface-variant tracking-wider font-mono">
                  SIGNAL: 0.04%
                </span>
              </div>
            </div>

            {/* Heading Block */}
            <div className="text-center max-w-2xl px-gutter-mobile md:px-0 mt-space-md">
              <div className="flex items-center justify-center gap-space-xs mb-space-xs"></div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mb-space-sm">
                Missão Perdida no Ciberespaço
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Parece que seu esquadrão explorou uma rota fora do radar
                corporativo. O link acessado foi desativado, movido ou consumido
                por uma anomalia de rede temporária.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col items-center gap-space-md mt-4 mb-space-xl">
              <div className="flex flex-wrap items-center justify-center gap-space-md w-full">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center justify-center gap-space-sm bg-primary-container text-on-primary-container hover:bg-primary px-space-lg py-space-md rounded-xl font-label-lg text-label-lg shadow-lg hover:shadow-cyan-500/25 transition-all w-full sm:w-auto cursor-pointer"
                >
                  <span>Voltar para a página anterior</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Terminal Log */}
            <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-space-md shadow-2xl">
              <div className="flex items-center justify-between pb-space-sm mb-space-sm bg-surface-container-low/40 -mx-space-md -mt-space-md px-space-md pt-space-xs rounded-t-xl">
                <div className="flex items-center gap-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-tertiary/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
                  <span className="font-label-sm text-[11px] text-outline uppercase ml-2 tracking-widest font-mono">
                    NEXUS_KERNEL_DIAGNOSTIC.LOG
                  </span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-sm text-[10px] text-tertiary font-mono">
                    SECURE PROTOCOL
                  </span>
                </div>
              </div>

              <div className="font-mono text-body-sm text-xs space-y-1 text-on-surface-variant overflow-x-auto select-all">
                <div className="text-outline">
                  &gt; NEXUS_OS core telemetry scan initiated at sector:
                  [404_UNKNOWN]
                </div>
                <div className="text-error">
                  &gt; ERROR: route '/unknown_sector' not mapped to registered
                  tactical assets.
                </div>
                <div className="text-secondary">
                  &gt; Protocol engaged: SQUAD_RECOVERY_ENGAGED // Host
                  integrity 100%
                </div>
                <div className="text-tertiary flex items-center gap-1">
                  <span>
                    &gt; Recommendation: Retorne à base operacional mais próxima
                    através da interface central.
                  </span>
                  <span className="inline-block w-2 h-3.5 bg-primary animate-pulse ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-lowest py-space-md px-gutter pb-space-xl">
        <div className="w-full flex flex-col md:flex-row items-center justify-between text-outline font-body-sm text-body-sm gap-space-xs">
          <p>NEXUS © 2025 • Sistema Corporativo de Gamificação e Performance</p>
          <div className="flex items-center gap-space-md">
            <span className="flex items-center gap-1.5 text-tertiary">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
              Servidores Operacionais
            </span>
            <span>v2.8.4-ent</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
