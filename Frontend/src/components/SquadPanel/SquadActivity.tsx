import type { PointTransactionType, SquadActivityItem } from "../../lib/squads";
import { formatLastAccess } from "../../lib/users";

const TYPE_STYLE: Record<PointTransactionType, { icon: string; box: string; amount: string }> = {
  TASK_COMPLETED: { icon: "task_alt", box: "bg-tertiary/10 text-tertiary", amount: "text-tertiary" },
  TASK_BONUS: { icon: "bolt", box: "bg-primary/10 text-primary", amount: "text-primary" },
  ACHIEVEMENT_UNLOCKED: { icon: "military_tech", box: "bg-secondary/10 text-secondary", amount: "text-secondary" },
  ADMIN_ADJUSTMENT: { icon: "tune", box: "bg-surface-container-high text-on-surface-variant", amount: "text-on-surface-variant" },
  PENALTY: { icon: "warning", box: "bg-error/10 text-error", amount: "text-error" },
};

function describe(item: SquadActivityItem) {
  switch (item.type) {
    case "TASK_COMPLETED":
      return item.task ? `concluiu a missão "${item.task.title}"` : "concluiu uma missão";
    case "TASK_BONUS":
      return item.task ? `ganhou bônus em "${item.task.title}"` : "ganhou um bônus";
    case "ACHIEVEMENT_UNLOCKED":
      return "desbloqueou uma conquista";
    case "ADMIN_ADJUSTMENT":
      return item.description ?? "recebeu um ajuste de pontuação";
    case "PENALTY":
      return item.description ?? "recebeu uma penalidade";
  }
}

export function SquadActivity({ items }: { items: SquadActivityItem[] }) {
  return (
    <section className="rounded-2xl bg-surface-container-low p-4 shadow-lg md:p-space-lg">
      <div className="mb-space-md flex flex-wrap items-center justify-between gap-2 pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-xl text-primary">rss_feed</span>
          <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
            Atividades Recentes
          </h2>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
          Ainda não há atividades. Elas aparecem quando alguém do squad concluir uma missão.
        </p>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {items.map((item) => {
            const style = TYPE_STYLE[item.type];
            const sign = item.amount > 0 ? "+" : "";

            return (
              <div
                key={item.id}
                className="flex items-center justify-between gap-space-sm rounded-lg bg-surface-container/60 p-space-sm transition-colors hover:bg-surface-container"
              >
                <div className="flex min-w-0 items-center gap-space-sm">
                  <div
                    className={[
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                      style.box,
                    ].join(" ")}
                  >
                    <span className="material-symbols-outlined text-base">{style.icon}</span>
                  </div>

                  <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-space-sm">
                    <span className="font-label-md text-label-md text-on-surface">
                      {item.user.name}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {describe(item)}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end sm:flex-row sm:items-center sm:gap-space-sm">
                  <span className={["font-label-sm text-label-sm font-semibold", style.amount].join(" ")}>
                    {sign}
                    {item.amount} XP
                  </span>
                  <span className="font-label-sm text-label-sm text-outline">
                    {formatLastAccess(item.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
