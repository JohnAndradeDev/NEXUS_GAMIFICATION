import type { ReactNode } from "react";
import type { SquadStatsData } from "../../lib/squads";

type Tone = "primary" | "tertiary" | "secondary";

const TONE = {
  primary: { icon: "bg-primary/10 text-primary", bar: "bg-primary" },
  tertiary: { icon: "bg-tertiary/10 text-tertiary", bar: "bg-tertiary" },
  secondary: { icon: "bg-secondary/10 text-secondary", bar: "bg-secondary" },
} satisfies Record<Tone, { icon: string; bar: string }>;

interface StatCardProps {
  label: string;
  icon: string;
  tone: Tone;
  value: ReactNode;
  hint: string;
  hintIcon: string;
  bar?: number;
}

function StatCard({ label, icon, tone, value, hint, hintIcon, bar }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-surface-container-low p-space-md shadow-md transition-colors hover:bg-surface-container">
      <div className="mb-space-xs flex items-center justify-between gap-2">
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
          {label}
        </span>
        <div
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            TONE[tone].icon,
          ].join(" ")}
        >
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
      </div>

      <div>
        <div className="font-metric-display text-metric-display tracking-tight text-on-surface">
          {value}
        </div>
        <div className="mt-1 flex items-center gap-1 font-label-sm text-label-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">{hintIcon}</span>
          <span>{hint}</span>
        </div>
      </div>

      {bar !== undefined && (
        <div className="mt-space-sm h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
          <div
            className={["h-full rounded-full", TONE[tone].bar].join(" ")}
            style={{ width: `${Math.min(100, bar)}%` }}
          />
        </div>
      )}
    </div>
  );
}

const numberFormat = new Intl.NumberFormat("pt-BR");

export function SquadStats({ stats }: { stats: SquadStatsData }) {
  const participation =
    stats.memberCount === 0 ? 0 : (stats.activeMembersThisWeek / stats.memberCount) * 100;

  return (
    <section className="mb-space-lg grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <StatCard
        label="Pontuação do Squad"
        icon="workspace_premium"
        tone="primary"
        value={numberFormat.format(stats.totalPoints)}
        hint={`+${numberFormat.format(stats.weekPoints)} pts esta semana`}
        hintIcon="trending_up"
      />

      <StatCard
        label="Meta do Ciclo"
        icon="flag"
        tone="tertiary"
        value={`${stats.completionRate}%`}
        hint={`${stats.tasksCompleted}/${stats.tasksTotal} entregas`}
        hintIcon="schedule"
        bar={stats.completionRate}
      />

      <StatCard
        label="Entregas no Prazo"
        icon="fact_check"
        tone="secondary"
        value={`${stats.onTimeRate}%`}
        hint="Concluídas dentro do prazo"
        hintIcon="verified_user"
        bar={stats.onTimeRate}
      />

      <StatCard
        label="Engajamento da Semana"
        icon="groups"
        tone="primary"
        value={`${stats.activeMembersThisWeek}/${stats.memberCount}`}
        hint="membros pontuaram em 7 dias"
        hintIcon="local_fire_department"
        bar={participation}
      />

      <StatCard
        label="Posição no Ranking"
        icon="trophy"
        tone="tertiary"
        value={`#${stats.rank}`}
        hint={`de ${stats.squadsCount} ${stats.squadsCount === 1 ? "squad" : "squads"}`}
        hintIcon="leaderboard"
      />
    </section>
  );
}
