import { Link } from "react-router";
import type { SquadMission, SquadOverview } from "../../lib/squads";
import { formatDue } from "../../lib/tasks";
import { getInitials } from "../../lib/users";

interface SquadTasksProps {
  overview: SquadOverview | null;
  loading: boolean;
  hasSquad: boolean;
}

const AVATAR_COLORS = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-surface-container-highest text-on-surface",
];

function MissionCard({ mission }: { mission: SquadMission }) {
  const cooperative = mission.assignees.length > 1;

  return (
    <div className="rounded-xl bg-surface-container-high/60 p-space-md">
      <div className="mb-space-sm flex flex-col gap-space-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary-container px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary-container">
              {cooperative ? "Missão Cooperativa" : "Missão do Squad"}
            </span>
            <span
              className={[
                "flex items-center gap-1 font-body-sm text-body-sm",
                mission.isOverdue ? "text-error" : "text-outline",
              ].join(" ")}
            >
              <span className="material-symbols-outlined text-xs">timer</span>
              {mission.isOverdue ? "Atrasada" : `Prazo: ${formatDue(mission.dueDate)}`}
            </span>
          </div>

          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
            {mission.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2 rounded-xl bg-surface-container px-space-md py-space-xs shadow-inner">
          <span className="material-symbols-outlined text-lg text-tertiary">
            workspace_premium
          </span>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm text-outline">Recompensa</span>
            <span className="font-label-lg text-label-lg font-extrabold leading-none text-tertiary">
              +{mission.basePoints} pts
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-sm">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container-highest">
          <div
            className="h-full rounded-full bg-linear-to-r from-secondary to-tertiary transition-all duration-700"
            style={{ width: `${mission.progress}%` }}
          />
        </div>
        <span className="shrink-0 font-label-sm text-label-sm text-on-surface-variant">
          {mission.progress}%
        </span>
      </div>
    </div>
  );
}

export function SquadTasks({ overview, loading, hasSquad }: SquadTasksProps) {
  const openMissions = overview?.missions.filter((mission) => mission.status !== "CONCLUIDA") ?? [];
  const shownMissions = openMissions.slice(0, 2);
  const members = overview?.members ?? [];
  const shownMembers = members.slice(0, 4);
  const extraMembers = members.length - shownMembers.length;

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-4 shadow-lg sm:p-space-lg">
      <div className="mb-space-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-secondary" />
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-headline-md text-lg font-bold text-on-surface sm:text-headline-md">
              Tarefas do Squad
            </h2>
            {overview && (
              <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-secondary-container">
                {overview.squad.name}
              </span>
            )}
          </div>
        </div>

        <span className="material-symbols-outlined text-xl text-secondary">group_work</span>
      </div>

      {!hasSquad && (
        <div className="flex flex-col items-center py-space-lg text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">groups</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Você ainda não faz parte de um squad
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Peça ao administrador para vinculá-lo a um squad e as missões coletivas aparecem aqui.
          </p>
        </div>
      )}

      {hasSquad && loading && !overview && (
        <p className="py-space-lg text-center font-body-sm text-body-sm text-outline">
          Carregando dados do squad...
        </p>
      )}

      {overview && (
        <div className="relative overflow-hidden rounded-xl bg-surface-container p-4 shadow-md sm:p-space-lg">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

          <div className="relative flex flex-col gap-space-sm">
            {shownMissions.length === 0 ? (
              <p className="rounded-xl bg-surface-container-high/60 p-space-md text-center font-body-sm text-body-sm text-outline">
                Nenhuma missão em aberto no squad no momento.
              </p>
            ) : (
              shownMissions.map((mission) => <MissionCard key={mission.id} mission={mission} />)
            )}
          </div>

          <div className="my-space-md flex flex-col">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-label-md text-label-md">
              <span className="font-medium text-on-surface-variant">Meta Coletiva do Ciclo</span>
              <span className="font-bold text-tertiary">
                {overview.stats.completionRate}% Concluído ({overview.stats.tasksCompleted}/
                {overview.stats.tasksTotal} entregas)
              </span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full rounded-full bg-linear-to-r from-secondary to-tertiary shadow-[0_0_12px_rgba(78,222,163,0.5)] transition-all duration-700"
                style={{ width: `${overview.stats.completionRate}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3 overflow-hidden">
                {shownMembers.map((member, index) => (
                  <span
                    key={member.id}
                    title={member.name}
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full font-label-sm text-label-sm font-bold ring-2 ring-surface-container",
                      AVATAR_COLORS[index % AVATAR_COLORS.length],
                    ].join(" ")}
                  >
                    {getInitials(member.name)}
                  </span>
                ))}
                {extraMembers > 0 && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest font-label-sm text-label-sm text-primary ring-2 ring-surface-container">
                    +{extraMembers}
                  </span>
                )}
              </div>

              <span className="font-body-sm text-body-sm text-outline">
                {members.length} {members.length === 1 ? "integrante" : "integrantes"} no squad
              </span>
            </div>

            <Link
              to="/squad"
              className="flex items-center gap-1 font-label-md text-label-md font-bold text-primary transition-colors hover:text-primary-fixed"
            >
              <span>Painel do Squad</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
