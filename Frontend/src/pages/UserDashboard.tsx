import { useEffect, useRef, useState } from "react";
import { AppLayout } from "../layout/AppLayout";
import { XpToast } from "../components/UserDashboard/XpToast";
import { DashboardHero } from "../components/UserDashboard/DashboardHero";
import { QuickMetrics } from "../components/UserDashboard/QuickMetrics";
import { IndividualTasks } from "../components/UserDashboard/IndividualTasks";
import { SquadTasks } from "../components/UserDashboard/SquadTasks";
import { SquadRanking } from "../components/UserDashboard/SquadRanking";
import { RecentAchievements } from "../components/UserDashboard/RecentAchievements";
import { useAuth } from "../contexts/AuthContext";
import { usePoints } from "../contexts/PointsContext";
import { getMyAchievements, type AchievementsData } from "../lib/achievements";
import { getSquadRanking, type SquadStanding } from "../lib/rankings";
import { getSquadOverview, type SquadOverview } from "../lib/squads";
import type { Reward } from "../lib/tasks";
import { getErrorMessages, type Paginated } from "../lib/users";

export function UserDashboard() {
  const { user, refreshUser } = useAuth();
  const { summary, refreshSummary } = usePoints();
  const squadId = user?.squadId ?? null;

  // incrementa para recarregar tarefas, squad, ranking e conquistas depois de concluir uma missão
  const [refreshKey, setRefreshKey] = useState(0);

  const [toast, setToast] = useState<{ title: string; detail: string } | null>(
    null,
  );
  const toastTimer = useRef<number | undefined>(undefined);

  const [ranking, setRanking] = useState<Paginated<SquadStanding> | null>(null);
  const [overview, setOverview] = useState<SquadOverview | null>(null);
  const [squadLoading, setSquadLoading] = useState(squadId !== null);
  const [squadError, setSquadError] = useState<string | null>(null);

  const [achievements, setAchievements] = useState<AchievementsData | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    getMyAchievements()
      .then((data) => {
        if (!cancelled) setAchievements(data);
      })
      .catch(() => {
        // mantém a última lista carregada
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  useEffect(() => {
    if (squadId === null) return;

    let cancelled = false;
    setSquadLoading(true);
    setSquadError(null);

    Promise.all([getSquadOverview(squadId), getSquadRanking({ perPage: 5 })])
      .then(([overviewData, rankingData]) => {
        if (cancelled) return;
        setOverview(overviewData);
        setRanking(rankingData);
      })
      .catch((err) => {
        if (!cancelled) setSquadError(getErrorMessages(err).join(" "));
      })
      .finally(() => {
        if (!cancelled) setSquadLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [squadId, refreshKey]);

  function handleCompleted({
    title,
    reward,
  }: {
    title: string;
    reward: Reward | null;
  }) {
    window.clearTimeout(toastTimer.current);

    const unlocked = reward?.achievements ?? [];
    const bonus = unlocked.reduce((sum, item) => sum + item.pointsBonus, 0);
    const details: string[] = [];
    if (unlocked.length > 0) {
      details.push(
        `Conquista desbloqueada: ${unlocked.map((item) => item.name).join(", ")}`,
      );
    }
    if (reward?.leveledUp)
      details.push(`Você subiu para o nível ${reward.level}!`);

    setToast({
      title: `Parabéns! +${(reward?.pointsAwarded ?? 0) + bonus} XP concedidos`,
      detail:
        details.length > 0
          ? details.join(" • ")
          : `"${title}" concluída com sucesso`,
    });
    toastTimer.current = window.setTimeout(() => setToast(null), 6000);

    setRefreshKey((key) => key + 1);
    void refreshSummary(); // pontos, sequência e posições
    void refreshUser(); // XP e nível no header
  }

  return (
    <AppLayout activePage="user">
      <div className="flex w-full flex-col pb-space-xl">
        {toast && (
          <XpToast
            title={toast.title}
            detail={toast.detail}
            onClose={() => setToast(null)}
          />
        )}

        <DashboardHero
          summary={summary}
          squadRank={
            overview
              ? {
                  position: overview.stats.rank,
                  total: overview.stats.squadsCount,
                }
              : null
          }
        />
        <QuickMetrics summary={summary} />

        {squadError && (
          <p
            role="alert"
            className="mb-space-md rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error"
          >
            Não foi possível carregar os dados do squad: {squadError}
          </p>
        )}

        <div className="grid w-full grid-cols-1 gap-space-lg lg:grid-cols-12">
          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <IndividualTasks
              refreshKey={refreshKey}
              onCompleted={handleCompleted}
            />
            <SquadTasks
              overview={overview}
              loading={squadLoading}
              hasSquad={squadId !== null}
            />
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-5">
            <SquadRanking
              items={ranking?.items ?? []}
              total={ranking?.meta.total ?? 0}
              mySquadId={squadId}
            />
            <RecentAchievements data={achievements} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
