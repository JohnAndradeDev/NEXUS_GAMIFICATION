interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function AddMemberModal({
  isOpen,
  onClose,
  onConfirm,
}: AddMemberModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-2xl">
                group_add
              </span>
            </div>

            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Adicionar ao CyberTitans
              </h3>

              <p className="font-body-sm text-body-sm text-outline">
                Alocar recurso técnico corporativo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block font-label-sm text-label-sm uppercase text-outline">
              Colaborador Disponível
            </label>

            <select className="h-11 w-full rounded-xl bg-surface-container-high px-3 font-body-md text-body-md text-on-surface outline-none">
              <option>Guilherme Prado — Cloud Arch</option>
              <option>Aline Meireles — Mobile Engineer</option>
              <option>Felipe Ramos — Data Pipelines</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block font-label-sm text-label-sm uppercase text-outline">
              Atribuição de Papel
            </label>

            <select className="h-11 w-full rounded-xl bg-surface-container-high px-3 font-body-md text-body-md text-on-surface outline-none">
              <option>Desenvolvedor Core • Tempo Integral</option>
              <option>Suporte Tático • Alocação 50%</option>
              <option>Co-Líder Técnico</option>
            </select>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-surface-container-lowest p-3.5">
            <span className="material-symbols-outlined shrink-0 text-secondary">
              info
            </span>

            <p className="font-body-sm text-body-sm text-outline">
              Ao incluir o profissional, os pontos futuros conquistados em
              missões serão calculados na média do CyberTitans.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-surface-container-high px-4 py-2.5 font-label-md text-label-md text-on-surface hover:bg-surface-container-highest sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-xl bg-primary-container px-5 py-2.5 font-headline-sm text-headline-sm text-on-primary-container shadow-[0_0_14px_rgba(6,182,212,0.3)] hover:bg-primary sm:w-auto"
          >
            Confirmar Alocação
          </button>
        </div>
      </div>
    </div>
  );
}
