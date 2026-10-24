import { useEffect, useState } from "react";
import { AppLayout } from "../layouts/AppLayout";
import { MyPositionCard } from "../components/Ranking/MyPositionCard";
import { Podium } from "../components/Ranking/Podium";
import {
  RankingControls,
  type RankingScope,
  type RankingTab,
} from "../components/Ranking/RankingControls";
import { RankingList } from "../components/Ranking/RankingList";
import { useAuth } from "../contexts/AuthContext";
import {
  getSquadRanking,
  getUserRanking,
  type RankingEntry,
  type RankingMe,
  type RankingPeriod,
  type SquadStanding,
  type UserStanding,
} from "../lib/rankings";
import { getErrorMessages, getInitials, type Paginated } from "../lib/users";

const PER_PAGE = 10;

const PERIOD_TEXT: Record<RankingPeriod, string> = {
  week: "Pontos conquistados nos últimos 7 dias",
  month: "Pontos conquistados desde o dia 1º do mês",
  all: "Todo o histórico de pontos",
};

const DELTA_TEXT: Record<RankingPeriod, string> = {
  week: "Variação: posições frente aos 7 dias anteriores",
  month: "Variação: posições frente ao mês anterior",
  all: "Variação: posições na última semana",
};

function fromUser(standing: UserStanding, myId: number): RankingEntry {
  return {
    key: `u${standing.id}`,
    position: standing.position,
    title: standing.name,
    subtitle: [standing.jobTitle ?? "Colaborador", standing.squad?.name].filter(Boolean).join(" • "),
    extra: `Nível ${standing.level}`,
    points: standing.points,
    delta: standing.delta,
    highlight: standing.id === myId,
    initials: getInitials(standing.name),
    avatarUrl: standing.avatarUrl,
  };
}

function fromSquad(
  standing: SquadStanding,
  mySquadId: number | null,
  period: RankingPeriod,
): RankingEntry {
  return {
    key: `s${standing.id}`,
    position: standing.position,
    title: standing.name,
    subtitle: standing.description ?? `${standing.memberCount} membros`,
    // as entregas são do histórico inteiro, então só aparecem no ranking geral
    extra:
      period === "all"
        ? `${standing.tasksCompleted}/${standing.tasksTotal} entregas`
        : `${standing.memberCount} membros`,
    points: standing.points,
    delta: standing.delta,
    highlight: standing.id === mySquadId,
    initials: getInitials(standing.name),
    avatarUrl: null,
  };
}

export function Ranking() {
  const { user } = useAuth();
  const userId = user?.id;
  const squadId = user?.squadId ?? null;

  const [tab, setTab] = useState<RankingTab>("users");
  const [period, setPeriod] = useState<RankingPeriod>("week");
  const [scope, setScope] = useState<RankingScope>("all");
  const [page, setPage] = useState(1);

  const [entries, setEntries] = useState<RankingEntry[]>([]);
  const [podium, setPodium] = useState<RankingEntry[]>([]);
  const [meta, setMeta] = useState<Paginated<unknown>["meta"] | null>(null);
  const [me, setMe] = useState<RankingMe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (userId === undefined) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const request =
      tab === "users"
        ? getUserRanking({
            page,
            perPage: PER_PAGE,
            period,
            squadId: scope === "mine" && squadId !== null ? squadId : undefined,
          }).then((result) => ({
            entries: result.items.map((item) => fromUser(item, userId)),
            meta: result.meta,
            me: result.me,
          }))
        : getSquadRanking({ page, perPage: PER_PAGE, period }).then((result) => ({
            entries: result.items.map((item) => fromSquad(item, squadId, period)),
            meta: result.meta,
            me: result.me,
          }));

    request
      .then((result) => {
        if (cancelled) return;
        setEntries(result.entries);
        setMeta(result.meta);
        setMe(result.me);
        // o pódio sempre vem da primeira página, mesmo se a pessoa estiver na 2ª
        if (page === 1) setPodium(result.entries.slice(0, 3));
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
  }, [tab, period, scope, page, reloadKey, userId, squadId]);

  function changeTab(next: RankingTab) {
    if (next === tab) return;
    setTab(next);
    setPage(1);
    setEntries([]);
    setPodium([]);
    setMe(null);
  }

  function changePeriod(next: RankingPeriod) {
    setPeriod(next);
    setPage(1);
  }

  function changeScope(next: RankingScope) {
    setScope(next);
    setPage(1);
  }

  const podiumHasPoints = (podium[0]?.points ?? 0) > 0;

  return (
    <AppLayout activePage="ranking">
      <div className="flex w-full flex-col pb-space-xl">
        <header className="mb-space-lg">
          <h1 className="font-headline-lg text-2xl tracking-tight text-on-surface sm:text-headline-xl">
            Ranking
          </h1>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {PERIOD_TEXT[period]}. No empate, vale a ordem alfabética.
          </p>
        </header>

        <RankingControls
          tab={tab}
          onTab={changeTab}
          period={period}
          onPeriod={changePeriod}
          scope={scope}
          onScope={changeScope}
          canFilterBySquad={squadId !== null}
        />

        {me && (
          <MyPositionCard
            label={tab === "users" ? "Sua posição" : "Posição do seu squad"}
            me={me}
            unit={tab === "users" ? "colaboradores" : "squads"}
          />
        )}

        {podiumHasPoints && <Podium entries={podium} />}

        {!podiumHasPoints && !loading && !error && podium.length > 0 && (
          <p className="mb-space-lg rounded-xl bg-surface-container-low p-space-md text-center font-body-sm text-body-sm text-outline">
            Ninguém pontuou neste período ainda. O pódio aparece assim que houver pontos.
          </p>
        )}

        <RankingList
          entries={entries}
          loading={loading}
          error={error}
          onRetry={() => setReloadKey((key) => key + 1)}
          meta={meta}
          page={page}
          onPage={setPage}
          highlightLabel={tab === "users" ? "Você" : "Seu squad"}
          deltaHint={DELTA_TEXT[period]}
        />
      </div>
    </AppLayout>
  );
}
