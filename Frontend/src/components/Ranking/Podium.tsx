import type { RankingEntry } from "../../lib/rankings";
import { DeltaBadge } from "./DeltaBadge";
import { EntryAvatar } from "./EntryAvatar";

const numberFormat = new Intl.NumberFormat("pt-BR");

const MEDALS: Record<number, { badge: string; ring: string; glow: string }> = {
  1: {
    badge: "bg-[#F59E0B] text-surface-container-lowest",
    ring: "ring-2 ring-[#F59E0B]/60",
    glow: "shadow-[0_0_28px_rgba(245,158,11,0.25)]",
  },
  2: {
    badge: "bg-on-surface-variant text-surface-container-lowest",
    ring: "ring-1 ring-outline/50",
    glow: "",
  },
  3: {
    badge: "bg-[#B45309] text-on-surface",
    ring: "ring-1 ring-[#B45309]/60",
    glow: "",
  },
};

// No celular os três ficam em coluna (1º, 2º, 3º); a partir de md o 1º vai ao centro.
const ORDER: Record<number, string> = { 1: "md:order-2", 2: "md:order-1", 3: "md:order-3" };

export function Podium({ entries }: { entries: RankingEntry[] }) {
  const top = entries.slice(0, 3);

  if (top.length === 0) return null;

  return (
    <section
      aria-label="Top 3"
      className="mb-space-lg grid grid-cols-1 gap-space-md md:grid-cols-3 md:items-end"
    >
      {top.map((entry) => {
        const medal = MEDALS[entry.position] ?? MEDALS[3]!;
        const first = entry.position === 1;

        return (
          <article
            key={entry.key}
            className={[
              "relative flex flex-col items-center rounded-xl bg-surface-container-low p-space-md text-center shadow-lg",
              medal.ring,
              medal.glow,
              ORDER[entry.position] ?? "",
              first ? "md:pb-space-xl md:pt-space-lg" : "",
            ].join(" ")}
          >
            <span
              className={[
                "absolute -top-3 flex h-7 min-w-7 items-center justify-center rounded-full px-2 font-headline-sm text-headline-sm",
                medal.badge,
              ].join(" ")}
            >
              {entry.position}º
            </span>

            <div className="mt-space-sm">
              <EntryAvatar entry={entry} size="lg" />
            </div>

            <h3 className="mt-space-sm max-w-full truncate font-headline-sm text-headline-sm text-on-surface">
              {entry.title}
              {entry.highlight && (
                <span className="ml-1.5 rounded bg-primary/20 px-1.5 py-0.5 align-middle font-label-sm text-label-sm text-primary">
                  Você
                </span>
              )}
            </h3>
            <p className="max-w-full truncate font-body-sm text-body-sm text-outline">
              {entry.subtitle}
            </p>

            <p className="mt-space-sm font-metric-display text-2xl text-primary">
              {numberFormat.format(entry.points)}
              <span className="ml-1 font-label-sm text-label-sm text-outline">pts</span>
            </p>

            <div className="mt-1 flex items-center gap-2 font-label-sm text-label-sm text-outline">
              <span>{entry.extra}</span>
              <DeltaBadge delta={entry.delta} />
            </div>
          </article>
        );
      })}
    </section>
  );
}
