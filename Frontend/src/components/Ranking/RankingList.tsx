import type { RankingEntry } from "../../lib/rankings";
import type { Paginated } from "../../lib/users";
import { DeltaBadge } from "./DeltaBadge";
import { EntryAvatar } from "./EntryAvatar";

const numberFormat = new Intl.NumberFormat("pt-BR");

interface RankingListProps {
  entries: RankingEntry[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  meta: Paginated<unknown>["meta"] | null;
  page: number;
  onPage: (page: number) => void;
  highlightLabel: string; // "Você" ou "Seu squad"
  deltaHint: string;
}

export function RankingList({
  entries,
  loading,
  error,
  onRetry,
  meta,
  page,
  onPage,
  highlightLabel,
  deltaHint,
}: RankingListProps) {
  return (
    <section className="overflow-hidden rounded-xl bg-surface-container-low shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-surface-container-highest/60 px-4 py-space-sm sm:px-space-lg">
        <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
          Classificação completa
        </h2>
        <span className="font-body-sm text-body-sm text-outline">{deltaHint}</span>
      </div>

      {loading && entries.length === 0 && (
        <p className="p-12 text-center font-body-sm text-body-sm text-outline">
          Carregando ranking...
        </p>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2 p-12 text-center">
          <p role="alert" className="font-body-md text-body-md text-error">
            {error}
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div className="flex flex-col items-center p-12 text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">leaderboard</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">Ranking vazio</p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Ainda não há ninguém para listar neste filtro.
          </p>
        </div>
      )}

      {entries.length > 0 && (
        <ol
          className={[
            "divide-y divide-surface-container-highest/40 transition-opacity",
            loading ? "opacity-50" : "",
          ].join(" ")}
        >
          {entries.map((entry) => (
            <li
              key={entry.key}
              className={[
                "flex items-center gap-space-sm px-4 py-3 sm:px-space-lg",
                entry.highlight
                  ? "bg-primary/10 shadow-[inset_3px_0_0_0_rgba(76,215,246,1)]"
                  : "transition-colors hover:bg-surface-container/50",
              ].join(" ")}
            >
              <span
                className={[
                  "w-8 shrink-0 text-center font-headline-sm text-headline-sm",
                  entry.position <= 3 ? "text-[#F59E0B]" : "text-outline",
                ].join(" ")}
              >
                {entry.position}º
              </span>

              <EntryAvatar entry={entry} />

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-x-1.5">
                  <span
                    className={[
                      "truncate font-label-md text-label-md font-bold",
                      entry.highlight ? "text-primary" : "text-on-surface",
                    ].join(" ")}
                  >
                    {entry.title}
                  </span>
                  {entry.highlight && (
                    <span className="rounded bg-primary/20 px-1.5 py-0.5 font-label-sm text-label-sm text-primary">
                      {highlightLabel}
                    </span>
                  )}
                </div>
                <p className="truncate font-body-sm text-body-sm text-outline">{entry.subtitle}</p>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-label-lg text-label-lg font-bold text-on-surface">
                  {numberFormat.format(entry.points)}{" "}
                  <span className="font-body-sm text-body-sm font-normal text-outline">pts</span>
                </p>
                <p className="hidden font-label-sm text-label-sm text-outline sm:block">
                  {entry.extra}
                </p>
              </div>

              <div className="w-10 shrink-0 text-center">
                <DeltaBadge delta={entry.delta} />
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-surface-container-highest/60 bg-surface-container-low/50 p-space-md text-center font-body-sm text-body-sm text-outline sm:flex-row sm:text-left">
        <div>
          Exibindo {entries.length} de {meta?.total ?? 0}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1}
              onClick={() => onPage(page - 1)}
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
              onClick={() => onPage(page + 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
