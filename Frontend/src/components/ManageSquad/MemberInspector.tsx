import type { RosterMember, RosterQueueItem } from "../../lib/squads";
import { formatDue } from "../../lib/tasks";
import { getInitials } from "../../lib/users";

interface MemberInspectorProps {
  member: RosterMember | null;
  totalPoints: number;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

function queueState(item: RosterQueueItem) {
  if (new Date(item.dueDate).getTime() < Date.now()) {
    return { label: "Atrasada", dot: "bg-error", chip: "bg-error/10 text-error", pulse: false };
  }
  if (item.status === "EM_ANDAMENTO") {
    return { label: "Em Andamento", dot: "bg-primary", chip: "bg-primary/10 text-primary", pulse: true };
  }
  return { label: "Na Fila", dot: "bg-outline", chip: "bg-surface-container-high text-outline", pulse: false };
}

export function MemberInspector({ member, totalPoints }: MemberInspectorProps) {
  if (!member) {
    return (
      <aside className="flex w-full flex-col gap-6 xl:col-span-4">
        <div className="rounded-2xl bg-surface-container-low p-6 text-center shadow-xl">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">contact_page</span>
          <p className="font-body-sm text-body-sm text-outline">
            Selecione um integrante para ver a ficha.
          </p>
        </div>
      </aside>
    );
  }

  const inProgress = member.queue.filter((item) => item.status === "EM_ANDAMENTO").length;
  const waiting = member.queue.length - inProgress;

  return (
    <aside className="flex w-full flex-col gap-6 xl:col-span-4">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 shadow-xl sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />

        <div className="flex items-center gap-2 border-b border-surface-container-high pb-4">
          <span className="material-symbols-outlined text-xl text-primary">contact_page</span>
          <span className="font-headline-sm text-headline-sm text-on-surface">
            Ficha do Integrante
          </span>
        </div>

        <div className="my-4 flex items-center gap-3.5 rounded-xl bg-surface-container-lowest/60 px-3.5 py-4 sm:my-5 sm:gap-4 sm:px-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-on-primary shadow-md">
            {getInitials(member.name)}

            <span className="absolute -right-1 -top-1 rounded-md bg-secondary-container px-1.5 py-0.5 font-label-sm text-label-sm font-bold text-on-secondary-container">
              #{member.position}
            </span>
          </div>

          <div className="flex min-w-0 flex-col">
            <h3 className="truncate font-headline-md text-headline-md text-on-surface">
              {member.name}
            </h3>

            <p className="truncate font-body-sm text-body-sm text-outline">
              {[member.jobTitle ?? "Colaborador", member.sector].filter(Boolean).join(" • ")}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                {numberFormat.format(member.points)} XP coletados
              </span>
              <span className="text-outline">•</span>
              <span className="font-label-sm text-label-sm text-tertiary">
                Nível {member.level}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6">
          <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3.5">
            <div className="mb-1 flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase">Pontualidade</span>
              <span className="material-symbols-outlined text-base text-tertiary">timer</span>
            </div>

            <p className="font-headline-md text-headline-md text-on-surface">
              {member.onTimeRate}%
            </p>

            <p className="font-body-sm text-body-sm font-medium text-tertiary">Entregas no prazo</p>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3.5">
            <div className="mb-1 flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase">Finalizado</span>
              <span className="material-symbols-outlined text-base text-primary">task_alt</span>
            </div>

            <p className="font-headline-md text-headline-md text-on-surface">
              {member.tasksCompleted}
            </p>

            <p className="font-body-sm text-body-sm text-outline">Tarefas fechadas</p>
          </div>
        </div>

        <div className="mb-5 space-y-3 rounded-xl bg-surface-container p-3.5 sm:mb-6 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface">
              Impacto na Pontuação Coletiva
            </span>

            <span className="font-label-md text-label-md font-bold text-primary">
              {member.share}%
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-primary-container shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all duration-500"
              style={{ width: `${member.share}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-body-sm text-body-sm text-outline">
            <span>Quota individual</span>
            <span>Total Squad: {numberFormat.format(totalPoints)} pts</span>
          </div>
        </div>

        <div className="mb-5 space-y-2.5 sm:mb-6 sm:space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="font-label-md text-label-md text-on-surface">
              Fila de Tarefas Operacionais
            </span>

            <span className="font-label-sm text-label-sm text-outline">
              {inProgress} Em Curso • {waiting} na Fila
            </span>
          </div>

          {member.queue.length === 0 ? (
            <p className="rounded-lg bg-surface-container-lowest/80 p-3 text-center font-body-sm text-body-sm text-outline">
              Nenhuma tarefa pendente.
            </p>
          ) : (
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {member.queue.map((item) => {
                const state = queueState(item);

                return (
                  <div
                    key={item.taskId}
                    className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-lowest/80 p-3"
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className={[
                          "h-2 w-2 shrink-0 rounded-full",
                          state.dot,
                          state.pulse ? "animate-pulse" : "",
                        ].join(" ")}
                      />
                      <div className="min-w-0">
                        <p className="truncate font-body-md text-body-md text-on-surface">
                          {item.title}
                        </p>
                        <p className="font-body-sm text-body-sm text-outline">
                          Prazo: {formatDue(item.dueDate)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={[
                        "shrink-0 rounded px-2 py-0.5 font-label-sm text-label-sm",
                        state.chip,
                      ].join(" ")}
                    >
                      {state.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface">Arsenal de Conquistas</span>
            <span className="font-label-sm text-label-sm font-bold text-secondary">
              {member.achievements.length} {member.achievements.length === 1 ? "Badge" : "Badges"}
            </span>
          </div>

          {member.achievements.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl bg-surface-container p-4 text-center">
              <span className="material-symbols-outlined mb-1 text-2xl text-outline">lock</span>
              <p className="font-body-sm text-body-sm text-outline">
                Este integrante ainda não desbloqueou conquistas.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {member.achievements.slice(0, 8).map((achievement) => (
                <div
                  key={achievement.id}
                  title={`${achievement.name}: ${achievement.description}`}
                  className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container p-2.5"
                >
                  <span className="material-symbols-outlined text-2xl text-primary">
                    {achievement.icon ?? "military_tech"}
                  </span>
                  <span className="w-full truncate text-center font-label-sm text-label-sm text-outline">
                    {achievement.name}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
