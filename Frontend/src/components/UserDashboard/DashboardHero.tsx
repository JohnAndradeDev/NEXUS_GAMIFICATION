import { useAuth } from "../../contexts/AuthContext";
import type { PointsSummary, RankPosition } from "../../lib/points";
import { getInitials } from "../../lib/users";

interface DashboardHeroProps {
  summary: PointsSummary | null;
  squadRank?: RankPosition | null;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

export function DashboardHero({ summary, squadRank = null }: DashboardHeroProps) {
  const { user } = useAuth();

  if (!user) return null;

  const progress = summary?.progress;
  const level = progress?.level ?? user.level;

  return (
    <section className="relative mb-space-lg overflow-hidden rounded-xl bg-surface-container-low p-4 shadow-xl sm:p-space-lg">
      <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col items-start gap-space-lg xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-start gap-space-md md:items-center">
          <div className="relative shrink-0">
            <div className="h-20 w-20 overflow-hidden rounded-2xl bg-surface-container shadow-[0_0_24px_rgba(6,182,212,0.35)] md:h-24 md:w-24">
              {user.avatarUrl ? (
                <img
                  alt={`Foto de ${user.name}`}
                  className="h-full w-full object-cover"
                  src={user.avatarUrl}
                />
              ) : (
                <div
                  aria-label={`Foto de ${user.name}`}
                  className="flex h-full w-full items-center justify-center bg-primary-container text-2xl font-bold text-on-primary-container md:text-3xl"
                >
                  {getInitials(user.name)}
                </div>
              )}
            </div>

            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary shadow-md">
              <span className="material-symbols-outlined text-xs">
                military_tech
              </span>
              LVL {level}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-1 flex flex-wrap items-center gap-space-xs">
              {user.jobTitle && (
                <span className="rounded-full bg-secondary-container px-space-xs py-0.5 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-on-secondary-container">
                  {user.jobTitle}
                </span>
              )}

            </div>

            <h1 className="font-headline-lg text-xl font-bold tracking-tight text-on-surface sm:text-headline-lg">
              Olá, {user.name}! Pronto para completar suas missões de hoje?
            </h1>

            <p className="mt-0.5 font-body-md text-body-md text-outline">
              {user.squad ? (
                squadRank ? (
                <>
                  Seu esquadrão{" "}
                  <span className="font-semibold text-primary">
                    {user.squad.name}
                  </span>{" "}
                  ocupa a {squadRank.position}ª posição entre {squadRank.total}{" "}
                  {squadRank.total === 1 ? "squad" : "squads"} no ranking
                  corporativo.
                </>
              ) : (
                <>
                  Você faz parte do esquadrão{" "}
                  <span className="font-semibold text-primary">
                    {user.squad.name}
                  </span>
                  .
                </>
              )
              ) : (
                "Você ainda não faz parte de um squad. Peça ao administrador para vinculá-lo a um."
              )}
            </p>
          </div>
        </div>

        <div className="w-full rounded-xl bg-surface-container p-space-md shadow-inner xl:w-96">
          <div className="mb-2 flex items-center justify-between font-label-md text-label-md">
            <span className="flex items-center gap-1 font-semibold text-on-surface">
              <span className="material-symbols-outlined text-base text-primary">
                upgrade
              </span>
              Progresso do Nível
            </span>

            <span className="font-bold text-primary-fixed-dim">
              {progress ? `${progress.percent}%` : "—"}
            </span>
          </div>

          <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary-container via-primary to-tertiary shadow-[0_0_12px_rgba(6,182,212,0.6)] transition-all duration-1000"
              style={{ width: `${progress?.percent ?? 0}%` }}
            />
          </div>

          <div className="flex items-center justify-between font-body-sm text-body-sm text-outline">
            <span>
              {progress
                ? `${numberFormat.format(progress.currentXp)} / ${numberFormat.format(progress.neededXp)} XP`
                : "—"}
            </span>

            <span className="font-medium text-on-surface-variant">
              {progress && (
                <>
                  Faltam{" "}
                  <strong className="text-primary">
                    {numberFormat.format(progress.xpToNext)} XP
                  </strong>{" "}
                  para o Nvl {progress.level + 1}
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
