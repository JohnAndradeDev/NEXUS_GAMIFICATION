import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { ActivityTimeline } from "../components/ManagerDashboard/ActivityTimeline";
import { CorporateRanking } from "../components/ManagerDashboard/CorporateRanking";
import { ManagerHeader } from "../components/ManagerDashboard/ManagerHeader";
import { SquadMetrics } from "../components/ManagerDashboard/SquadMetrics";
import { SquadTaskForm } from "../components/ManagerDashboard/SquadTaskForm";
import { SquadTaskList } from "../components/ManagerDashboard/SquadTaskList";
import { useAuth } from "../contexts/AuthContext";
import { getSquadRanking, type SquadStanding } from "../lib/rankings";
import { getSquadOverview, type SquadOverview } from "../lib/squads";
import { getErrorMessages, type Paginated } from "../lib/users";

export function ManagerDashboard() {
  const { user } = useAuth();
  const squadId = user?.squadId ?? null;

  const [overview, setOverview] = useState<SquadOverview | null>(null);
  const [ranking, setRanking] = useState<Paginated<SquadStanding> | null>(null);
  const [loading, setLoading] = useState(squadId !== null);
  const [error, setError] = useState<string | null>(null);

  // incrementa para recarregar métricas, ranking e atividades depois de criar uma tarefa
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (squadId === null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([getSquadOverview(squadId), getSquadRanking({ perPage: 5 })])
      .then(([overviewData, rankingData]) => {
        if (cancelled) return;
        setOverview(overviewData);
        setRanking(rankingData);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessages(err).join(" "));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [squadId, refreshKey]);

  return (
    <AppLayout activePage="manager">
      <div className="flex w-full flex-col pb-space-xl">
        {squadId === null && (
          <div className="rounded-xl bg-surface-container-low p-space-xl text-center shadow-md">
            <span className="material-symbols-outlined mb-2 text-5xl text-outline">
              shield_question
            </span>
            <p className="font-headline-md text-headline-md text-on-surface">
              Você ainda não está associado a um squad
            </p>
            <p className="mt-1 font-body-md text-body-md text-outline">
              Um gestor precisa de um squad para administrar tarefas. Peça ao administrador para
              vinculá-lo a um.
            </p>
          </div>
        )}

        {squadId !== null && loading && !overview && (
          <p className="py-space-xl text-center font-body-md text-body-md text-outline">
            Carregando dashboard do squad...
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-low p-space-xl text-center shadow-md">
            <p role="alert" className="font-body-md text-body-md text-error">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setRefreshKey((key) => key + 1)}
              className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {overview && (
          <>
            <ManagerHeader name={overview.squad.name} description={overview.squad.description} />
            <SquadMetrics stats={overview.stats} members={overview.members} />
            <SquadTaskForm
              members={overview.members}
              onCreated={() => setRefreshKey((key) => key + 1)}
            />

            <SquadTaskList
              members={overview.members}
              refreshKey={refreshKey}
              onChanged={() => setRefreshKey((key) => key + 1)}
            />

            <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
              <CorporateRanking
                items={ranking?.items ?? []}
                total={ranking?.meta.total ?? 0}
                mySquadId={squadId}
              />
              <ActivityTimeline items={overview.activity} />
            </section>
          </>
        )}
      </div>
    </AppLayout>
  );
}
