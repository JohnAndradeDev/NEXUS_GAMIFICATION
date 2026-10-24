import { useEffect, useState } from "react";
import { addSquadMember, getCandidates, type Candidate } from "../../lib/squads";
import { getErrorMessages, getInitials } from "../../lib/users";

interface AddMemberModalProps {
  isOpen: boolean;
  squadId: number;
  squadName: string;
  onClose: () => void;
  onAdded: (name: string) => void;
}

// O formulário fica em outro componente para o estado reiniciar a cada abertura
export function AddMemberModal(props: AddMemberModalProps) {
  if (!props.isOpen) return null;

  return <AddMemberForm {...props} />;
}

function AddMemberForm({ squadId, squadName, onClose, onAdded }: AddMemberModalProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getCandidates(squadId, debouncedSearch)
      .then((result) => {
        if (!cancelled) setCandidates(result.items);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(getErrorMessages(err).join(" "));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [squadId, debouncedSearch]);

  async function handleConfirm() {
    if (!selected) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await addSquadMember(squadId, selected.id);
      onAdded(selected.name);
    } catch (err) {
      setSubmitError(getErrorMessages(err).join(" "));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface-container p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-2xl">group_add</span>
            </div>

            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Adicionar ao {squadName}
              </h3>

              <p className="font-body-sm text-body-sm text-outline">
                Colaboradores que ainda não têm squad
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="rounded-lg p-1 text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-outline">
              search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nome, e-mail ou cargo..."
              className="h-11 w-full rounded-xl bg-surface-container-high pl-10 pr-3 font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container-highest"
            />
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {loading && candidates.length === 0 && (
              <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
                Buscando colaboradores...
              </p>
            )}

            {loadError && (
              <p role="alert" className="py-space-md text-center font-body-sm text-body-sm text-error">
                {loadError}
              </p>
            )}

            {!loading && !loadError && candidates.length === 0 && (
              <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
                Nenhum colaborador disponível. Só aparecem usuários ativos sem squad.
              </p>
            )}

            {candidates.map((candidate) => {
              const isSelected = selected?.id === candidate.id;

              return (
                <button
                  key={candidate.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(candidate)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all",
                    isSelected
                      ? "bg-primary/15 ring-1 ring-primary/50"
                      : "bg-surface-container-high hover:bg-surface-container-highest",
                  ].join(" ")}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
                    {isSelected ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : (
                      getInitials(candidate.name)
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-label-md text-label-md text-on-surface">
                      {candidate.name}
                    </p>
                    <p className="truncate font-label-sm text-label-sm text-outline">
                      {[candidate.jobTitle ?? "Colaborador", candidate.sector, `Nível ${candidate.level}`]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-surface-container-lowest p-3.5">
            <span className="material-symbols-outlined shrink-0 text-secondary">info</span>

            <p className="font-body-sm text-body-sm text-outline">
              A pontuação do squad é a soma dos pontos dos membros, então os pontos que o
              colaborador já tem também passam a contar para o {squadName}.
            </p>
          </div>

          {submitError && (
            <p role="alert" className="font-body-sm text-body-sm text-error">
              {submitError}
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full rounded-xl bg-surface-container-high px-4 py-2.5 font-label-md text-label-md text-on-surface hover:bg-surface-container-highest disabled:opacity-60 sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selected || submitting}
            className="w-full rounded-xl bg-primary-container px-5 py-2.5 font-headline-sm text-headline-sm text-on-primary-container shadow-[0_0_14px_rgba(6,182,212,0.3)] hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? "Adicionando..." : "Confirmar Alocação"}
          </button>
        </div>
      </div>
    </div>
  );
}
