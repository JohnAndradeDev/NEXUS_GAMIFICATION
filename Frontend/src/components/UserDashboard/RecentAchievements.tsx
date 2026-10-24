import type { AchievementsData } from "../../lib/achievements";

interface RecentAchievementsProps {
  data: AchievementsData | null;
}

// as cores só enfeitam; o banco não guarda cor por conquista
const TONES = [
  { icon: "text-primary", glow: "group-hover:shadow-[0_0_16px_rgba(76,215,246,0.5)]" },
  { icon: "text-error", glow: "group-hover:shadow-[0_0_16px_rgba(255,180,171,0.5)]" },
  { icon: "text-[#F59E0B]", glow: "group-hover:shadow-[0_0_16px_rgba(245,158,11,0.5)]" },
  { icon: "text-secondary", glow: "group-hover:shadow-[0_0_16px_rgba(208,188,255,0.5)]" },
  { icon: "text-tertiary", glow: "group-hover:shadow-[0_0_16px_rgba(78,222,163,0.5)]" },
];

const numberFormat = new Intl.NumberFormat("pt-BR");

export function RecentAchievements({ data }: RecentAchievementsProps) {
  const unlocked = data?.unlocked ?? [];

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-4 shadow-lg sm:p-space-lg">
      <div className="mb-space-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-secondary-fixed-dim" />
          <h2 className="font-headline-md text-lg font-bold text-on-surface sm:text-headline-md">
            Conquistas Recentes
          </h2>
        </div>

        <span className="whitespace-nowrap font-label-sm text-label-sm text-outline">
          {data ? `${data.unlockedCount} Desbloqueada${data.unlockedCount === 1 ? "" : "s"}` : "—"}
        </span>
      </div>

      {data && unlocked.length === 0 && (
        <div className="flex flex-col items-center rounded-xl bg-surface-container p-space-lg text-center">
          <span className="material-symbols-outlined mb-2 text-3xl text-outline">lock</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhuma conquista ainda
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Elas aparecem aqui conforme você for desbloqueando.
          </p>
        </div>
      )}

      {unlocked.length > 0 && (
        <div className="grid grid-cols-3 gap-space-sm sm:grid-cols-5">
          {unlocked.map((item, index) => {
            const tone = TONES[index % TONES.length]!;

            return (
              <div key={item.id} className="group relative flex flex-col items-center">
                <div
                  className={[
                    "h-12 w-12 cursor-pointer rounded-2xl bg-surface-container shadow-md transition-all group-hover:scale-110 sm:h-14 sm:w-14",
                    tone.glow,
                  ].join(" ")}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <span className={["material-symbols-outlined text-2xl", tone.icon].join(" ")}>
                      {item.icon ?? "military_tech"}
                    </span>
                  </div>
                </div>

                <span className="mt-1 w-full truncate text-center font-label-sm text-label-sm text-outline group-hover:text-on-surface">
                  {item.name}
                </span>

                <div className="pointer-events-none absolute -top-14 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-surface-container-highest px-2 py-1 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
                  <p className="font-label-sm text-label-sm font-bold">{item.description}</p>
                  <p className="font-body-sm text-[10px] text-outline">
                    Conquistada em{" "}
                    {new Date(item.unlockedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
                    {item.pointsBonus > 0 ? ` • +${numberFormat.format(item.pointsBonus)} pts` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {data?.next && (
        <div className="mt-space-md flex items-center justify-between gap-space-sm rounded-xl bg-linear-to-r from-surface-container to-surface-container-high p-space-md shadow-inner">
          <div className="flex min-w-0 flex-1 items-center gap-space-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container text-on-secondary-container">
              <span className="material-symbols-outlined text-xl">
                {data.next.icon ?? "lock_open"}
              </span>
            </div>

            <div className="flex min-w-0 flex-col">
              <span className="font-label-md text-label-md font-bold text-on-surface">
                Próximo Badge: {data.next.name}
              </span>
              <span className="font-body-sm text-body-sm text-outline">
                Faltam {numberFormat.format(data.next.remaining)} {data.next.unit}
              </span>
            </div>
          </div>

          <span className="shrink-0 font-label-sm text-label-sm font-bold text-primary">
            {data.next.progress}%
          </span>
        </div>
      )}
    </section>
  );
}
