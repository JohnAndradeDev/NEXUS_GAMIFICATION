import type { SquadAchievement } from "../../lib/squads";

interface SquadBadgesProps {
  achievements: SquadAchievement[];
  memberCount: number;
}

export function SquadBadges({ achievements, memberCount }: SquadBadgesProps) {
  return (
    <section className="flex flex-col gap-space-md lg:col-span-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-xl text-amber-400">military_tech</span>
          <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
            Insígnias Desbloqueadas
          </h2>
        </div>
        <span className="font-label-sm text-label-sm text-outline">
          {achievements.length} {achievements.length === 1 ? "ativa" : "ativas"}
        </span>
      </div>

      {achievements.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-surface-container-low p-space-lg text-center shadow-md">
          <div className="mb-space-sm flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-high text-outline">
            <span className="material-symbols-outlined text-2xl">lock</span>
          </div>
          <p className="font-headline-sm text-headline-sm text-on-surface">Nenhuma insígnia ainda</p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            As conquistas dos integrantes do squad aparecem aqui conforme forem desbloqueadas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-space-sm">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-space-sm rounded-xl bg-surface-container-low p-space-sm shadow-md transition-colors hover:bg-surface-container"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-container-high text-primary">
                <span className="material-symbols-outlined text-2xl">
                  {item.icon ?? "military_tech"}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-label-md text-label-md font-bold text-on-surface">
                  {item.name}
                </p>
                <p className="truncate font-body-sm text-body-sm text-outline">{item.description}</p>
              </div>

              <span className="shrink-0 rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm text-primary">
                {item.count}/{memberCount}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
