import type { PointTransactionType, SquadActivityItem } from "../../lib/squads";
import { formatLastAccess } from "../../lib/users";

const TYPE_STYLE: Record<PointTransactionType, { icon: string; dot: string }> = {
  TASK_COMPLETED: {
    icon: "check",
    dot: "bg-tertiary text-surface-container-lowest shadow-[0_0_10px_rgba(78,222,163,0.5)]",
  },
  TASK_BONUS: {
    icon: "bolt",
    dot: "bg-primary text-on-primary shadow-[0_0_10px_rgba(76,215,246,0.6)]",
  },
  ACHIEVEMENT_UNLOCKED: {
    icon: "shield",
    dot: "bg-secondary-container text-on-secondary-container shadow-[0_0_10px_rgba(87,27,193,0.6)]",
  },
  ADMIN_ADJUSTMENT: {
    icon: "tune",
    dot: "bg-surface-container-highest text-on-surface-variant",
  },
  PENALTY: {
    icon: "local_fire_department",
    dot: "bg-error text-on-error shadow-[0_0_12px_rgba(255,180,171,0.5)]",
  },
};

function describe(item: SquadActivityItem) {
  switch (item.type) {
    case "TASK_COMPLETED":
      return item.task ? (
        <>
          Concluiu a tarefa{" "}
          <strong className="text-on-surface">"{item.task.title}"</strong>
        </>
      ) : (
        "Concluiu uma tarefa"
      );
    case "TASK_BONUS":
      return item.task ? (
        <>
          Ganhou bônus em <strong className="text-on-surface">"{item.task.title}"</strong>
        </>
      ) : (
        "Ganhou um bônus"
      );
    case "ACHIEVEMENT_UNLOCKED":
      return "Desbloqueou uma conquista";
    case "ADMIN_ADJUSTMENT":
      return item.description ?? "Recebeu um ajuste de pontuação";
    case "PENALTY":
      return item.description ?? "Recebeu uma penalidade";
  }
}

export function ActivityTimeline({ items }: { items: SquadActivityItem[] }) {
  return (
    <section className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-4 shadow-md backdrop-blur-md sm:p-space-lg">
      <div>
        <div className="mb-space-md flex items-center gap-space-sm border-b border-surface-container-highest/60 pb-space-sm">
          <span className="material-symbols-outlined text-xl text-secondary">history_toggle_off</span>

          <div>
            <h3 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Atividades Recentes
            </h3>
            <p className="font-body-sm text-body-sm text-outline">
              Pontuações recentes dos membros do squad
            </p>
          </div>
        </div>

        {items.length === 0 ? (
          <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
            Nada por aqui ainda. As conclusões de tarefas do squad aparecem neste fluxo.
          </p>
        ) : (
          <div className="relative flex flex-col gap-space-md overflow-hidden pl-6 before:absolute before:bottom-2 before:left-2.5 before:top-2 before:w-0.5 before:bg-surface-container-highest before:content-['']">
            {items.map((item) => {
              const style = TYPE_STYLE[item.type];

              return (
                <div key={item.id} className="relative flex flex-col gap-1">
                  <div
                    className={[
                      "absolute -left-6 top-1 flex h-5 w-5 items-center justify-center rounded-full",
                      style.dot,
                    ].join(" ")}
                  >
                    <span className="material-symbols-outlined text-xs font-bold">{style.icon}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="font-label-md text-label-md text-on-surface">
                      {item.user.name}
                    </span>
                    <span className="shrink-0 font-body-sm text-body-sm text-outline">
                      {formatLastAccess(item.createdAt)}
                    </span>
                  </div>

                  <p className="wrap-break-word font-body-md text-body-md text-on-surface-variant">
                    {describe(item)}
                  </p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-space-xs">
                    <span
                      className={[
                        "rounded px-space-xs py-0.5 font-label-sm text-label-sm",
                        item.amount >= 0
                          ? "bg-tertiary/10 text-tertiary-fixed-dim"
                          : "bg-error/10 text-error",
                      ].join(" ")}
                    >
                      {item.amount > 0 ? "+" : ""}
                      {item.amount} pts Squad
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
