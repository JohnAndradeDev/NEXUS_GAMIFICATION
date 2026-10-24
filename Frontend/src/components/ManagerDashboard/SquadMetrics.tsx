import type { SquadMember, SquadStatsData } from "../../lib/squads";
import { getInitials } from "../../lib/users";

const numberFormat = new Intl.NumberFormat("pt-BR");
const ONLINE_WINDOW_MS = 15 * 60 * 1000;

const AVATAR_COLORS = ["bg-primary", "bg-secondary", "bg-tertiary"];

function sparkline(values: number[]) {
  const max = Math.max(...values, 1);
  const step = 100 / (values.length - 1);
  const line = values
    .map((value, index) => {
      const x = (index * step).toFixed(1);
      const y = (22 - (value / max) * 20).toFixed(1);
      return `${index === 0 ? "M" : "L"}${x} ${y}`;
    })
    .join(" ");

  return { line, area: `${line} V24 H0 Z` };
}

interface SquadMetricsProps {
  stats: SquadStatsData;
  members: SquadMember[];
}

export function SquadMetrics({ stats, members }: SquadMetricsProps) {
  const spark = sparkline(stats.pointsByDay);

  const toLeader = Math.max(0, stats.leaderPoints - stats.totalPoints);
  const shareOfLeader =
    stats.leaderPoints === 0 ? 100 : Math.min(100, (stats.totalPoints / stats.leaderPoints) * 100);

  const online = members.filter(
    (member) =>
      member.lastLoginAt && Date.now() - new Date(member.lastLoginAt).getTime() < ONLINE_WINDOW_MS,
  ).length;
  const engagement =
    stats.memberCount === 0 ? 0 : Math.round((stats.activeMembersThisWeek / stats.memberCount) * 100);

  const shownMembers = members.slice(0, 3);
  const extraMembers = members.length - shownMembers.length;

  return (
    <section className="mb-space-xl grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {/* Pontuação total */}
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md transition-all hover:bg-surface-container sm:p-space-md">
        <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-primary/10 blur-xl" />

        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">
            Pontuação Total
          </span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">military_tech</span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              {numberFormat.format(stats.totalPoints)}
            </span>
            <span className="font-label-sm text-label-sm text-outline">pts</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-tertiary">trending_up</span>
            <span className="font-label-sm text-label-sm text-tertiary">
              +{numberFormat.format(stats.weekPoints)}
            </span>
            <span className="font-body-sm text-body-sm text-outline">esta semana</span>
          </div>
        </div>

        <svg className="mt-space-md h-6 w-full text-primary" viewBox="0 0 100 24" fill="none" aria-hidden="true">
          <path d={spark.line} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={spark.area} fill="currentColor" fillOpacity="0.12" />
        </svg>
      </div>

      {/* Posição geral */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">Posição Geral</span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary-container/30 text-secondary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">leaderboard</span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-secondary">
              #{stats.rank}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              de {stats.squadsCount}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-secondary">flag</span>
            {toLeader === 0 ? (
              <span className="font-label-sm text-label-sm text-on-surface">Liderando o ranking</span>
            ) : (
              <>
                <span className="font-label-sm text-label-sm text-on-surface">
                  {numberFormat.format(toLeader)} pts
                </span>
                <span className="font-body-sm text-body-sm text-outline">p/ líder</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-space-md">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full rounded-full bg-secondary" style={{ width: `${shareOfLeader}%` }} />
          </div>
          <div className="mt-1 flex items-center justify-between font-label-sm text-label-sm text-outline">
            <span>{Math.round(shareOfLeader)}% do líder</span>
            <span>{numberFormat.format(stats.leaderPoints)} pts</span>
          </div>
        </div>
      </div>

      {/* Membros ativos */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">Membros Ativos</span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tertiary/10 text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">groups</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              {stats.memberCount}
            </span>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim">
              / {online} online
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
            <span className="font-label-sm text-label-sm text-tertiary">
              {engagement}% Engajados
            </span>
          </div>
        </div>

        <div className="mt-space-md flex items-center -space-x-2 overflow-hidden py-1">
          {shownMembers.map((member, index) => (
            <div
              key={member.id}
              title={member.name}
              className={[
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-surface-container-lowest ring-2 ring-surface-container-low",
                AVATAR_COLORS[index % AVATAR_COLORS.length],
              ].join(" ")}
            >
              {getInitials(member.name)}
            </div>
          ))}
          {extraMembers > 0 && (
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-highest text-xs text-primary ring-2 ring-surface-container-low">
              +{extraMembers}
            </div>
          )}
        </div>
      </div>

      {/* Tarefas feitas */}
      <div className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">Tarefas Feitas</span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tertiary-container/30 text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">task_alt</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              {stats.tasksCompleted}
            </span>
            <span className="font-label-sm text-label-sm text-outline">
              / {stats.tasksTotal} metas
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-tertiary">check_circle</span>
            <span className="font-label-sm text-label-sm text-tertiary">
              {stats.completionRate}% Sucesso
            </span>
          </div>
        </div>

        <div className="mt-space-md flex items-center gap-space-sm">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
            <div className="h-full rounded-full bg-tertiary" style={{ width: `${stats.completionRate}%` }} />
          </div>
          <span className="shrink-0 font-label-sm text-label-sm text-outline">
            {stats.tasksOpen} Rest.
          </span>
        </div>
      </div>

      {/* Em risco e backlog */}
      <div className="col-span-2 flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-3 shadow-md backdrop-blur-md sm:p-space-md md:col-span-1">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-md text-label-md text-outline">Em Risco & Backlog</span>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-error-container/40 text-error sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">warning</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-space-xs">
            <span className="font-metric-display text-metric-display text-on-surface">
              {stats.tasksInProgress}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">em andamento</span>
          </div>

          {stats.tasksOverdue > 0 ? (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-error-container px-space-xs py-0.5 font-label-sm text-label-sm text-on-error-container">
              <span className="material-symbols-outlined text-xs">priority_high</span>
              {stats.tasksOverdue} {stats.tasksOverdue === 1 ? "Atrasada" : "Atrasadas"}
            </span>
          ) : (
            <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-tertiary/10 px-space-xs py-0.5 font-label-sm text-label-sm text-tertiary">
              <span className="material-symbols-outlined text-xs">check</span>
              Nenhuma atrasada
            </span>
          )}
        </div>

        <div className="mt-space-md flex items-center justify-between font-label-sm text-label-sm text-outline">
          <span>{stats.tasksOverdue > 0 ? "Atenção necessária" : "Cadência em dia"}</span>
          {stats.tasksOverdue > 0 ? (
            <span className="flex items-center gap-0.5 text-error">
              <span className="h-1.5 w-1.5 rounded-full bg-error" />
              Crítico
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-tertiary">
              <span className="h-1.5 w-1.5 rounded-full bg-tertiary" />
              Normal
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
