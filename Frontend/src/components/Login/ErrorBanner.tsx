import { AlertCircle, X } from "lucide-react";

interface ErrorBannerProps {
  onDismiss: () => void;
}

export function ErrorBanner({ onDismiss }: ErrorBannerProps) {
  return (
    <section className="mb-space-md flex items-start gap-space-sm rounded-lg border border-error/50 bg-error-container/20 p-2.5 sm:p-space-sm">
      <AlertCircle size={20} className="mt-0.5 shrink-0 text-error" />

      <div className="flex-1">
        <p className="text-xs font-medium text-error sm:text-label-md">
          Falha de Autenticação
        </p>

        <p className="text-xs text-on-surface-variant sm:text-body-sm">
          Chave de acesso corporativa inválida para o domínio indicado.
        </p>
      </div>

      <button
        type="button"
        aria-label="Fechar erro"
        onClick={onDismiss}
        className="rounded p-1 text-on-surface-variant transition hover:text-on-surface"
      >
        <X size={16} />
      </button>
    </section>
  );
}
