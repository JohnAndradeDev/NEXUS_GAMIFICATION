import type { SquadMission } from "../../lib/squads";
import { formatDue, type TaskDifficulty } from "../../lib/tasks";
import { getInitials } from "../../lib/users";

const DIFFICULTY_LABEL: Record<TaskDifficulty, string> = {
  FACIL: "FÁCIL",
  MEDIO: "MÉDIO",
  DIFICIL: "DIFÍCIL",
};

const AVATAR_COLORS = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
];

function missionState(mission: SquadMission) {
  if (mission.status === "CONCLUIDA") {
    return {
      label: "CONCLUÍDA",
      icon: "task_alt",
      chip: "bg-tertiary/15 text-tertiary",
      box: "bg-tertiary/10 text-tertiary",
      bar: "bg-tertiary",
    };
  }
  if (mission.isOverdue) {
    return {
      label: "ATRASADA",
      icon: "warning",
      chip: "bg-error/15 text-error",
      box: "bg-error/10 text-error",
      bar: "bg-error",
    };
  }
  if (mission.status === "EM_ANDAMENTO") {
    return {
      label: "EM ANDAMENTO",
      icon: "hub",
      chip: "bg-primary/15 text-primary",
      box: "bg-primary/10 text-primary",
      bar: "bg-primary",
    };
  }
  return {
    label: "PENDENTE",
    icon: "schedule",
    chip: "bg-surface-container-high text-on-surface-variant",
    box: "bg-surface-container-high text-on-surface-variant",
    bar: "bg-outline",
  };
}

interface SquadMissionsProps {
  missions: SquadMission[];
  openCount: number;
}

export function SquadMissions({ missions, openCount }: SquadMissionsProps) {
  return (
    <section className="flex flex-col gap-space-md lg:col-span-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-xl text-primary">target</span>
          <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
            Missões do Squad
          </h2>
        </div>
        <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
          {openCount} em aberto
        </span>
      </div>

      {missions.length === 0 && (
        <div className="rounded-xl bg-surface-container-low p-space-lg text-center shadow-md">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">
            assignment
          </span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhuma missão cadastrada
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            As tarefas criadas para o squad aparecem aqui.
          </p>
        </div>
      )}

      {missions.map((mission) => {
        const state = missionState(mission);
        const done = mission.status === "CONCLUIDA";
        const shown = mission.assignees.slice(0, 4);
        const extra = mission.assignees.length - shown.length;

        return (
          <div
            key={mission.id}
            className="group relative overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-md transition-all hover:bg-surface-container"
          >
            <div className="mb-space-sm flex flex-col items-start justify-between gap-space-sm sm:flex-row sm:items-center">
              <div className="flex min-w-0 items-center gap-space-sm">
                <div
                  className={[
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                    state.box,
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined">{state.icon}</span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span
                      className={["rounded px-1.5 py-0.5 font-label-sm text-[10px]", state.chip].join(" ")}
                    >
                      {state.label}
                    </span>
                    {mission.category && (
                      <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-sm text-[10px] uppercase text-on-surface-variant">
                        {mission.category}
                      </span>
                    )}
                    <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-label-sm text-[10px] text-on-surface-variant">
                      {DIFFICULTY_LABEL[mission.difficulty]}
                    </span>
                  </div>

                  <h3 className="mt-0.5 font-headline-sm text-headline-sm text-on-surface">
                    {mission.title}
                  </h3>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-container-highest px-space-sm py-1">
                <span className="material-symbols-outlined text-sm text-tertiary">stars</span>
                <span className="font-label-md text-label-md text-tertiary">
                  +{mission.basePoints} pts
                </span>
              </div>
            </div>

            {mission.description && (
              <p className="mb-space-md font-body-sm text-body-sm text-on-surface-variant">
                {mission.description}
              </p>
            )}

            <div className="flex flex-col items-start justify-between gap-space-sm pt-space-xs sm:flex-row sm:items-center">
              <div className="w-full sm:w-1/2">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-outline">
                    Progresso Coletivo
                  </span>
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                    {mission.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div
                    className={["h-full rounded-full", state.bar].join(" ")}
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline">
                  {done && mission.completedAt
                    ? `Concluída em ${new Date(mission.completedAt).toLocaleDateString("pt-BR")}`
                    : `Prazo: ${formatDue(mission.dueDate)}`}
                </span>

                <div className="flex -space-x-2 overflow-hidden">
                  {shown.map((person, index) => (
                    <span
                      key={person.id}
                      title={person.name}
                      className={[
                        "flex h-6 w-6 items-center justify-center rounded-full font-label-sm text-[10px] ring-2 ring-surface-container-low",
                        AVATAR_COLORS[index % AVATAR_COLORS.length],
                      ].join(" ")}
                    >
                      {getInitials(person.name)}
                    </span>
                  ))}
                  {extra > 0 && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-container-highest font-label-sm text-[10px] text-on-surface-variant ring-2 ring-surface-container-low">
                      +{extra}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
