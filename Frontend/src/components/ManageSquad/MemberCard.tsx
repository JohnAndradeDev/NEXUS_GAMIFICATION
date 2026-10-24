import type { RosterMember } from "../../lib/squads";

interface MemberCardProps {
  member: RosterMember;
  isCurrentUser: boolean;
  isSelected: boolean;
  onInspect: () => void;
  onRemove: () => void;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

export function MemberCard({
  member,
  isCurrentUser,
  isSelected,
  onInspect,
  onRemove,
}: MemberCardProps) {
  const role = [member.jobTitle ?? "Colaborador", member.sector]
    .filter(Boolean)
    .join(" • ");

  return (
    <article className="group relative flex flex-col justify-between rounded-xl bg-surface-container-low p-4 shadow-md transition-all duration-300 hover:shadow-xl sm:p-5">
      {isSelected && (
        <div className="pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-primary/5" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
          <div className="relative flex shrink-0 items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high text-on-surface">
              <span className="font-headline-sm text-headline-sm">#{member.position}</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-headline-sm text-headline-sm text-on-surface">
                {member.name}
              </h2>

              {member.isManager && (
                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-label-sm text-label-sm leading-none text-amber-300">
                  Gestor
                </span>
              )}

              {isCurrentUser && (
                <span className="rounded bg-primary/20 px-1.5 py-0.5 font-label-sm text-label-sm leading-none text-primary">
                  Você
                </span>
              )}
            </div>

            <p className="truncate font-body-sm text-body-sm text-outline">{role}</p>
            <p className="truncate font-body-sm text-body-sm text-outline-variant">
              {member.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          disabled={isCurrentUser}
          title={isCurrentUser ? "Você não pode se remover do squad" : `Remover ${member.name}`}
          className="shrink-0 rounded-lg p-1 text-outline-variant transition-colors hover:bg-surface-container hover:text-error disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-outline-variant"
        >
          <span className="material-symbols-outlined text-lg">person_remove</span>
        </button>
      </div>

      <div className="my-3 flex flex-wrap items-center gap-2 sm:my-4">
        <span className="flex items-center gap-1 rounded-md bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-primary">
          <span className="material-symbols-outlined text-xs">bolt</span>
          {numberFormat.format(member.points)} pts
        </span>

        <span className="rounded-md bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm text-secondary">
          Nível {member.level}
        </span>
      </div>

      <div className="mb-4 space-y-1.5">
        <div className="flex items-center justify-between gap-2 font-label-sm text-label-sm">
          <span className="text-outline">Tarefas Concluídas</span>

          <span className="text-right font-semibold text-on-surface">
            {member.tasksCompleted} concluídas{" "}
            <span className="font-normal text-outline">
              / {member.tasksPending} pendentes
            </span>
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
          <div
            className="h-full rounded-full bg-linear-to-r from-primary to-tertiary"
            style={{ width: `${member.progress}%` }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onInspect}
        className={[
          "flex w-full items-center justify-center gap-1.5 rounded-lg py-2 font-label-md text-label-md transition-colors",
          isSelected
            ? "bg-primary-container font-bold text-on-primary-container shadow-[0_0_12px_rgba(6,182,212,0.25)]"
            : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
        ].join(" ")}
      >
        <span className="material-symbols-outlined text-base">
          {isSelected ? "dashboard_customize" : "visibility"}
        </span>

        {isSelected ? "Ficha em Exibição" : "Ver Perfil Detalhado"}
      </button>
    </article>
  );
}
