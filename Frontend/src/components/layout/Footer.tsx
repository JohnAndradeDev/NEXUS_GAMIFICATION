import { useEffect, useState } from "react";

type ServerStatus = "checking" | "online" | "offline";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const CHECK_MS = 60_000;

// a rota /health fica na raiz do servidor, fora do prefixo /api
function healthUrl() {
  try {
    return new URL("/health", API_URL).toString();
  } catch {
    return null;
  }
}

const STATUS_VIEW: Record<ServerStatus, { label: string; text: string; dot: string }> = {
  checking: { label: "Verificando servidor...", text: "text-outline", dot: "bg-outline" },
  online: { label: "Servidor online", text: "text-tertiary", dot: "bg-tertiary" },
  offline: { label: "Servidor indisponível", text: "text-error", dot: "bg-error" },
};

export function Footer() {
  const [status, setStatus] = useState<ServerStatus>("checking");

  // consulta a API de verdade, em vez de mostrar um aviso fixo
  useEffect(() => {
    const url = healthUrl();
    if (!url) {
      setStatus("offline");
      return;
    }

    const target = url;
    let cancelled = false;

    async function check() {
      try {
        const response = await fetch(target, {
          cache: "no-store",
          signal: AbortSignal.timeout(5000),
        });
        if (!cancelled) setStatus(response.ok ? "online" : "offline");
      } catch {
        if (!cancelled) setStatus("offline");
      }
    }

    void check();
    const timer = window.setInterval(check, CHECK_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const view = STATUS_VIEW[status];

  return (
    <footer className="w-full border-t border-surface-container-highest/40 bg-surface-container-lowest px-4 py-space-md sm:px-gutter">
      <div className="flex w-full flex-col items-center justify-between gap-space-xs text-center font-body-sm text-body-sm text-outline md:flex-row md:text-left">
        <p>
          NEXUS © {new Date().getFullYear()} • Sistema Corporativo de Gamificação e Performance
        </p>

        <span role="status" className={["flex items-center gap-1.5", view.text].join(" ")}>
          <span
            className={[
              "h-1.5 w-1.5 rounded-full",
              view.dot,
              status === "online" ? "animate-pulse" : "",
            ].join(" ")}
          />
          {view.label}
        </span>
      </div>
    </footer>
  );
}
