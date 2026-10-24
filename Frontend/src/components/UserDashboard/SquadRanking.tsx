import type { SquadStanding } from "../../lib/rankings";

const numberFormat = new Intl.NumberFormat("pt-BR");

const MEDAL: Record<number, string> = {
  1: "bg-[#F59E0B]/20 text-[#F59E0B]",
  2: "bg-surface-container-highest text-on-surface-variant",
  3: "bg-[#B45309]/20 text-[#B45309]",
};

interface CorporateRankingProps {
  items: SquadStanding[];
  total: number;
  mySquadId: number | null;
}

export function SquadRanking({
  items,
  total,
  mySquadId,
}: CorporateRankingProps) {
  return (
    <section className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-4 shadow-md backdrop-blur-md sm:p-space-lg">
      <div>
        <div className="mb-space-md flex items-center gap-space-sm border-b border-surface-container-highest/60 pb-space-sm">
          <span className="material-symbols-outlined text-xl text-primary">
            workspace_premium
          </span>

          <div>
            <h3 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Ranking Corporativo de Squads
            </h3>
            <p className="font-body-sm text-body-sm text-outline">
              Soma dos pontos dos membros ativos
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-500px border-collapse text-left">
            <thead>
              <tr className="border-b border-surface-container-highest/60 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                <th className="px-space-xs py-space-sm">Pos</th>
                <th className="px-space-sm py-space-sm">Squad</th>
                <th className="px-space-xs py-space-sm text-center">Membros</th>
                <th className="px-space-xs py-space-sm text-center">
                  Entregas
                </th>
                <th className="px-space-sm py-space-sm text-right">
                  Pontuação
                </th>
                <th className="px-space-xs py-space-sm text-center">
                  Variação
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-container-highest/40 font-body-md text-body-md">
              {items.map((squad) => {
                const mine = squad.id === mySquadId;

                return (
                  <tr
                    key={squad.id}
                    className={
                      mine
                        ? "bg-primary/10 shadow-[inset_3px_0_0_0_rgba(76,215,246,1)]"
                        : "transition-colors hover:bg-surface-container/50"
                    }
                  >
                    <td className="px-space-xs py-3">
                      <span
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-lg font-headline-sm text-headline-sm",
                          mine && squad.position > 3
                            ? "bg-primary text-on-primary"
                            : (MEDAL[squad.position] ?? "text-outline"),
                        ].join(" ")}
                      >
                        {squad.position}º
                      </span>
                    </td>

                    <td className="px-space-sm py-3">
                      <div className="flex flex-col">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span
                            className={[
                              "font-headline-sm text-headline-sm",
                              mine ? "text-primary" : "text-on-surface",
                            ].join(" ")}
                          >
                            {squad.name}
                          </span>
                          {mine && (
                            <span className="rounded bg-primary/20 px-1.5 py-0.5 font-label-sm text-label-sm text-primary-fixed-dim">
                              Seu Squad
                            </span>
                          )}
                        </div>
                        {squad.description && (
                          <span className="max-w-[16rem] truncate font-body-sm text-body-sm text-outline">
                            {squad.description}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-space-xs py-3 text-center text-on-surface-variant">
                      {squad.memberCount}
                    </td>
                    <td className="px-space-xs py-3 text-center">
                      {squad.tasksCompleted}/{squad.tasksTotal}
                    </td>

                    <td className="px-space-sm py-3 text-right">
                      <span className="font-headline-sm text-headline-sm">
                        {numberFormat.format(squad.points)}
                      </span>{" "}
                      <span className="font-body-sm text-body-sm text-outline">
                        pts
                      </span>
                    </td>

                    <td className="px-space-xs py-3 text-center">
                      {squad.delta > 0 ? (
                        <span className="flex items-center justify-center gap-0.5 font-label-sm text-label-sm font-bold text-tertiary">
                          <span className="material-symbols-outlined text-xs">
                            arrow_upward
                          </span>
                          +{squad.delta}
                        </span>
                      ) : squad.delta < 0 ? (
                        <span className="flex items-center justify-center gap-0.5 font-label-sm text-label-sm font-bold text-error">
                          <span className="material-symbols-outlined text-xs">
                            arrow_downward
                          </span>
                          {squad.delta}
                        </span>
                      ) : (
                        <span className="text-outline">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {items.length === 0 && (
          <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
            Nenhum squad ativo no ranking ainda.
          </p>
        )}
      </div>

      <div className="mt-space-sm flex flex-wrap items-center justify-between gap-2 pt-space-md font-body-sm text-body-sm text-outline">
        <span>
          Exibindo {items.length} de {total} {total === 1 ? "squad" : "squads"}
        </span>
        <span>Variação: posições na última semana</span>
      </div>
    </section>
  );
}
