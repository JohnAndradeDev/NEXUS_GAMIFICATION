import { useEffect, useState } from "react";
import {
  awardedText,
  listAchievements,
  recalculateAchievements,
  ruleText,
  setAchievementStatus,
  type AdminAchievement,
} from "../../lib/achievements";
import { getErrorMessages, type Paginated } from "../../lib/users";
import { AchievementAwardModal } from "./AchievementAwardModal";
import { AchievementFormModal } from "./AchievementFormModal";

interface AchievementDirectoryProps {
  refreshKey: number;
  onChanged: () => void;
  onToast: (message: string) => void;
}

const PER_PAGE = 12;

const selectClass =
  "rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none";

export function AchievementDirectory({ refreshKey, onChanged, onToast }: AchievementDirectoryProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<Paginated<AdminAchievement> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [formTarget, setFormTarget] = useState<AdminAchievement | "new" | null>(null);
  const [awardTarget, setAwardTarget] = useState<AdminAchievement | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [recalculating, setRecalculating] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

    listAchievements({ page, perPage: PER_PAGE, search: debouncedSearch, isActive: status })
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

  const items = data?.items ?? [];
  const meta = data?.meta;

  async function toggleStatus(item: AdminAchievement) {
    setBusyId(item.id);
    setActionError(null);

    try {
      const result = await setAchievementStatus(item.id, !item.isActive);
      onToast(
        item.isActive
          ? `Conquista ${item.name} desativada. Quem já desbloqueou mantém o histórico.`
          : `Conquista ${item.name} reativada.${awardedText(result.awarded)}`,
      );
      onChanged();
    } catch (err) {
      setActionError(getErrorMessages(err).join(" "));
    } finally {
      setBusyId(null);
    }
  }

  async function handleRecalculate() {
    setRecalculating(true);
    setActionError(null);

    try {
      const result = await recalculateAchievements();
      onToast(
        result.awarded === 0
          ? "Regras reaplicadas: ninguém tinha conquista pendente."
          : `Regras reaplicadas.${awardedText(result.awarded)}`,
      );
      onChanged();
    } catch (err) {
      setActionError(getErrorMessages(err).join(" "));
    } finally {
      setRecalculating(false);
    }
  }

  return (
    <section className="mt-space-xl overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container shadow-xl">
      <div className="flex flex-col gap-space-md border-b border-outline-variant/20 bg-surface-container-low/70 p-4 sm:p-space-lg">
        <div className="flex flex-wrap items-start justify-between gap-space-sm">
          <div>
            <h3 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Conquistas da Plataforma
            </h3>
            <p className="font-body-sm text-body-sm text-outline">
              Defina as regras e os bônus. O desbloqueio é automático quando a regra é cumprida
            </p>
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={handleRecalculate}
              disabled={recalculating}
              title="Confere todos os colaboradores e concede o que estiver pendente"
              className="flex items-center justify-center gap-2 rounded-lg bg-surface-container-high px-space-md py-2.5 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-lg">sync</span>
              {recalculating ? "Recalculando..." : "Recalcular"}
            </button>

            <button
              type="button"
              onClick={() => setFormTarget("new")}
              className="flex items-center justify-center gap-2 rounded-lg bg-primary-container px-space-md py-2.5 font-label-md text-label-md text-on-primary-container shadow-[0_0_16px_rgba(6,182,212,0.35)] transition-all hover:brightness-110"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nova Conquista
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[220px] flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
              search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar conquista pelo nome..."
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
            <option value="">Status (Todas)</option>
            <option value="true">Ativas</option>
            <option value="false">Desativadas</option>
          </select>
        </div>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mx-4 mt-4 rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error sm:mx-space-lg"
        >
          {actionError}
        </p>
      )}

      {loading && items.length === 0 && (
        <p className="p-12 text-center font-body-sm text-body-sm text-outline">
          Carregando conquistas...
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

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">military_tech</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhuma conquista encontrada
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Crie a primeira conquista ou mude os filtros.
          </p>
        </div>
      )}

      {items.length > 0 && (
        <div
          className={[
            "grid grid-cols-1 gap-space-md p-4 transition-opacity sm:grid-cols-2 sm:p-space-lg xl:grid-cols-3",
            loading ? "opacity-50" : "",
          ].join(" ")}
        >
          {items.map((item) => (
            <article
              key={item.id}
              className={[
                "flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md shadow-md",
                item.isActive ? "" : "opacity-60",
              ].join(" ")}
            >
              <div>
                <div className="mb-space-xs flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                      <span className="material-symbols-outlined text-2xl">
                        {item.icon ?? "military_tech"}
                      </span>
                    </div>
                    <h4 className="truncate font-headline-sm text-headline-sm text-on-surface">
                      {item.name}
                    </h4>
                  </div>

                  <span
                    className={[
                      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 font-label-sm text-label-sm",
                      item.isActive
                        ? "bg-tertiary-container/30 text-tertiary"
                        : "bg-surface-container-high text-outline",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-1.5 w-1.5 rounded-full",
                        item.isActive ? "bg-tertiary" : "bg-outline",
                      ].join(" ")}
                    />
                    {item.isActive ? "Ativa" : "Desativada"}
                  </span>
                </div>

                <p className="line-clamp-2 min-h-10 font-body-sm text-body-sm text-on-surface-variant">
                  {item.description}
                </p>

                <p className="mt-space-xs flex items-center gap-1 font-label-sm text-label-sm text-secondary">
                  <span className="material-symbols-outlined text-sm">rule</span>
                  {ruleText(item.type, item.target)}
                </p>

                <div className="mt-space-sm flex flex-wrap items-center gap-x-space-md gap-y-1 font-label-sm text-label-sm text-outline">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-tertiary">bolt</span>
                    {item.pointsBonus > 0 ? `+${item.pointsBonus} pts de bônus` : "Sem bônus"}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-primary">lock_open</span>
                    {item.unlockedCount}{" "}
                    {item.unlockedCount === 1 ? "desbloqueio" : "desbloqueios"}
                  </span>
                </div>
              </div>

              <div className="mt-space-md grid grid-cols-3 gap-2 border-t border-outline-variant/20 pt-space-sm">
                <button
                  type="button"
                  onClick={() => setFormTarget(item)}
                  className="flex h-10 flex-col items-center justify-center rounded-lg bg-surface-container px-1 font-label-md text-[11px] leading-none text-on-surface transition-colors hover:bg-surface-variant sm:flex-row sm:gap-1.5 sm:text-label-md"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  <span className="max-w-full truncate">Editar</span>
                </button>

                <button
                  type="button"
                  disabled={!item.isActive}
                  onClick={() => setAwardTarget(item)}
                  title={item.isActive ? "Conceder a um colaborador" : "Reative para conceder"}
                  className="flex h-10 flex-col items-center justify-center rounded-lg bg-surface-container px-1 font-label-md text-[11px] leading-none text-on-surface transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-40 sm:flex-row sm:gap-1.5 sm:text-label-md"
                >
                  <span className="material-symbols-outlined text-lg">card_giftcard</span>
                  <span className="max-w-full truncate">Conceder</span>
                </button>

                <button
                  type="button"
                  disabled={busyId === item.id}
                  onClick={() => toggleStatus(item)}
                  className="flex h-10 flex-col items-center justify-center rounded-lg bg-surface-container px-1 font-label-md text-[11px] leading-none text-on-surface transition-colors hover:bg-surface-variant hover:text-error disabled:opacity-50 sm:flex-row sm:gap-1.5 sm:text-label-md"
                >
                  <span className="material-symbols-outlined text-lg">
                    {item.isActive ? "toggle_on" : "toggle_off"}
                  </span>
                  <span className="max-w-full truncate">{item.isActive ? "Desativar" : "Reativar"}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-outline-variant/20 bg-surface-container-low/50 p-space-md text-center font-body-sm text-body-sm text-outline sm:flex-row sm:text-left">
        <div>
          Exibindo {items.length} de {meta?.total ?? 0}{" "}
          {meta?.total === 1 ? "conquista" : "conquistas"}
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

      <AchievementFormModal
        target={formTarget}
        onClose={() => setFormTarget(null)}
        onSaved={(message) => {
          setFormTarget(null);
          onToast(message);
          onChanged();
        }}
      />

      <AchievementAwardModal
        achievement={awardTarget}
        onClose={() => setAwardTarget(null)}
        onAwarded={(message) => {
          setAwardTarget(null);
          onToast(message);
          onChanged();
        }}
      />
    </section>
  );
}
