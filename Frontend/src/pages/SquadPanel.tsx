import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AppLayout } from "../layouts/AppLayout";
import { SquadActivity } from "../components/SquadPanel/SquadActivity";
import { SquadBadges } from "../components/SquadPanel/SquadBadges";
import { SquadMembers } from "../components/SquadPanel/SquadMembers";
import { SquadMissions } from "../components/SquadPanel/SquadMissions";
import { SquadOverviewHeader } from "../components/SquadPanel/SquadOverviewHeader";
import { SquadStats } from "../components/SquadPanel/SquadStats";
import { useAuth } from "../contexts/AuthContext";
import { getSquadOverview, type SquadOverview } from "../lib/squads";
import { getErrorMessages } from "../lib/users";

export function SquadPanel() {
  const { user } = useAuth();
  const squadId = user?.squadId ?? null;

  const [data, setData] = useState<SquadOverview | null>(null);
  const [loading, setLoading] = useState(squadId !== null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (squadId === null) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    getSquadOverview(squadId)
      .then((result) => {
        if (!cancelled) setData(result);
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
  }, [squadId, reloadKey]);

  return (
    <AppLayout activePage="mySquad">
      <div className="flex w-full flex-col pb-space-xl">
        <div className="mb-space-md flex items-center justify-between py-space-sm">
          <Link
            to="/"
            className="group inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>Voltar ao Meu Dashboard</span>
          </Link>
        </div>

        {squadId === null && (
          <div className="rounded-xl bg-surface-container-low p-space-xl text-center shadow-md">
            <span className="material-symbols-outlined mb-2 text-5xl text-outline">
              shield_question
            </span>
            <p className="font-headline-md text-headline-md text-on-surface">
              Você ainda não faz parte de um squad
            </p>
            <p className="mt-1 font-body-md text-body-md text-outline">
              Peça ao administrador para vinculá-lo a um squad e o painel aparece aqui.
            </p>
          </div>
        )}

        {squadId !== null && loading && !data && (
          <p className="py-space-xl text-center font-body-md text-body-md text-outline">
            Carregando painel do squad...
          </p>
        )}

        {error && (
          <div className="flex flex-col items-center gap-2 rounded-xl bg-surface-container-low p-space-xl text-center shadow-md">
            <p role="alert" className="font-body-md text-body-md text-error">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {data && user && (
          <>
            <SquadOverviewHeader data={data} />
            <SquadStats stats={data.stats} />

            <div className="mb-space-lg grid grid-cols-1 gap-space-lg lg:grid-cols-12">
              <SquadMissions missions={data.missions} openCount={data.stats.tasksOpen} />
              <SquadBadges achievements={data.achievements} memberCount={data.stats.memberCount} />
            </div>

            <SquadMembers members={data.members} currentUserId={user.id} />
            <SquadActivity items={data.activity} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
