import type { RankingMe } from "../../lib/rankings";
import { DeltaBadge } from "./DeltaBadge";

const numberFormat = new Intl.NumberFormat("pt-BR");

interface MyPositionCardProps {
  label: string;
  me: RankingMe;
  unit: string; // "colaboradores" ou "squads"
}

export function MyPositionCard({ label, me, unit }: MyPositionCardProps) {
  return (
    <section className="mb-space-lg flex flex-wrap items-center justify-between gap-space-md rounded-xl bg-primary/10 p-space-md shadow-[0_0_16px_rgba(6,182,212,0.2)]">
      <div className="flex items-center gap-space-md">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-on-primary">
          <span className="material-symbols-outlined text-2xl">leaderboard</span>
        </div>

        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-wider text-primary-fixed-dim">
            {label}
          </p>
          <p className="font-metric-display text-metric-display text-on-surface">
            {me.position}º{" "}
            <span className="font-body-md text-body-md font-normal text-outline">
              de {me.total} {unit}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-space-lg">
        <div className="text-right">
          <p className="font-headline-sm text-headline-sm text-on-surface">
            {numberFormat.format(me.points)} pts
          </p>
          <p className="font-label-sm text-label-sm text-outline">no período</p>
        </div>

        <div className="flex flex-col items-center">
          <DeltaBadge delta={me.delta} />
          <span className="font-label-sm text-label-sm text-outline">variação</span>
        </div>
      </div>
    </section>
  );
}
