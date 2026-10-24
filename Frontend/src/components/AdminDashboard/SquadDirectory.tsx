import { useEffect, useState } from "react";
import { listAllSquads, setSquadStatus, type AdminSquad } from "../../lib/squads";
import { getErrorMessages, type Paginated } from "../../lib/users";
import { SquadFormModal } from "./SquadFormModal";
import { SquadStatusModal } from "./SquadStatusModal";

interface SquadDirectoryProps {
  refreshKey: number;
  onChanged: () => void;
  onToast: (message: string) => void;
}

const PER_PAGE = 12;

const selectClass =
  "rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none";

export function SquadDirectory({ refreshKey, onChanged, onToast }: SquadDirectoryProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<Paginated<AdminSquad> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [formTarget, setFormTarget] = useState<AdminSquad | "new" | null>(null);
  const [statusTarget, setStatusTarget] = useState<AdminSquad | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listAllSquads({ page, perPage: PER_PAGE, search: debouncedSearch, isActive: status })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessages(err).join(" "));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, status, refreshKey, reloadKey]);

  const squads = data?.items ?? [];
  const meta = data?.meta;

  async function confirmStatus() {
    if (!statusTarget) return;

    setStatusSubmitting(true);
    setStatusError(null);

    try {
      await setSquadStatus(statusTarget.id, !statusTarget.isActive);
      onToast(
        `Squad ${statusTarget.name} ${statusTarget.isActive ? "desativado" : "reativado"} com sucesso.`,
      );
      setStatusTarget(null);
      onChanged();
    } catch (err) {
      setStatusError(getErrorMessages(err).join(" "));
    } finally {
      setStatusSubmitting(false);
    }
  }

  return (
    <section className="mt-space-xl overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-xl">
      <div className="flex flex-col gap-space-md border-b border-outline-variant/20 bg-surface-container-low/70 p-4 sm:p-space-lg">
        <div className="flex flex-wrap items-start justify-between gap-space-sm">
          <div>
            <h3 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Squads da Empresa
            </h3>
            <p className="font-body-sm text-body-sm text-outline">
              Crie squads, defina o gestor e ative ou desative equipes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFormTarget("new")}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-space-md py-2.5 font-label-md text-label-md text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.35)] transition-all hover:brightness-110 sm:w-auto"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Novo Squad
          </button>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[220px] flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
              search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar squad pelo nome..."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "" | "true" | "false");
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">Status (Todos)</option>
            <option value="true">Ativos</option>
            <option value="false">Desativados</option>
          </select>
        </div>
      </div>

      {loading && squads.length === 0 && (
        <p className="p-12 text-center font-body-sm text-body-sm text-outline">
          Carregando squads...
        </p>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2 p-12 text-center">
          <p role="alert" className="font-body-md text-body-md text-error">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && squads.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">groups</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhum squad encontrado
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Crie o primeiro squad ou mude os filtros.
          </p>
        </div>
      )}

      {squads.length > 0 && (
        <div
          className={[
            "grid grid-cols-1 gap-space-md p-4 transition-opacity sm:grid-cols-2 sm:p-space-lg xl:grid-cols-3",
            loading ? "opacity-50" : "",
          ].join(" ")}
        >
          {squads.map((squad) => (
            <article
              key={squad.id}
              className={[
                "flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md shadow-md",
                squad.isActive ? "" : "opacity-60",
              ].join(" ")}
            >
              <div>
                <div className="mb-space-xs flex items-start justify-between gap-2">
                  <h4 className="truncate font-headline-sm text-headline-sm text-on-surface">
                    {squad.name}
                  </h4>

                  <span
                    className={[
                      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-label-sm text-label-sm",
                      squad.isActive
                        ? "bg-tertiary-container/30 text-tertiary"
                        : "bg-surface-container-high text-outline",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        squad.isActive ? "bg-tertiary" : "bg-outline",
                      ].join(" ")}
                    />
                    {squad.isActive ? "Ativo" : "Desativado"}
                  </span>
                </div>

                <p className="line-clamp-2 min-h-10 font-body-sm text-body-sm text-on-surface-variant">
                  {squad.description ?? "Sem descrição."}
                </p>

                <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 font-label-sm text-label-sm text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-secondary">
                      shield_person
                    </span>
                    {squad.manager ? squad.manager.name : "Sem gestor"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">group</span>
                    {squad.memberCount} {squad.memberCount === 1 ? "membro" : "membros"}
                  </span>
                </div>
              </div>

              <div className="mt-space-md flex gap-2 border-t border-outline-variant/20 pt-space-sm">
                <button
                  type="button"
                  onClick={() => setFormTarget(squad)}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-container font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatusError(null);
                    setStatusTarget(squad);
                  }}
                  className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-container font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant hover:text-error"
                >
                  <span className="material-symbols-outlined text-lg">
                    {squad.isActive ? "toggle_on" : "toggle_off"}
                  </span>
                  {squad.isActive ? "Desativar" : "Reativar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-outline-variant/20 bg-surface-container-low/50 p-space-md text-center font-body-sm text-body-sm text-outline sm:flex-row sm:text-left">
        <div>
          Exibindo {squads.length} de {meta?.total ?? 0} {meta?.total === 1 ? "squad" : "squads"}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            <span className="px-2 font-label-md text-label-md text-on-surface">
              {page} / {meta.totalPages}
            </span>

            <button
              type="button"
              aria-label="Próxima página"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      <SquadFormModal
        target={formTarget}
        onClose={() => setFormTarget(null)}
        onSaved={(message) => {
          setFormTarget(null);
          onToast(message);
          onChanged();
        }}
      />

      <SquadStatusModal
        squad={statusTarget}
        submitting={statusSubmitting}
        error={statusError}
        onClose={() => setStatusTarget(null)}
        onConfirm={confirmStatus}
      />
    </section>
  );
}
