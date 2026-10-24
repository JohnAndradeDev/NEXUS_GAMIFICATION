import { useState } from "react";
import type { SquadMember } from "../../lib/squads";
import { getInitials } from "../../lib/users";

type SortKey = "points" | "level";

const AVATAR_COLORS = [
  "bg-secondary-container text-on-secondary-container",
  "bg-primary-container/30 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-surface-container-highest text-on-surface",
];

const ONLINE_WINDOW_MS = 15 * 60 * 1000;
const numberFormat = new Intl.NumberFormat("pt-BR");

function isOnline(lastLoginAt: string | null) {
  return !!lastLoginAt && Date.now() - new Date(lastLoginAt).getTime() < ONLINE_WINDOW_MS;
}

interface SquadMembersProps {
  members: SquadMember[];
  currentUserId: number;
}

export function SquadMembers({ members, currentUserId }: SquadMembersProps) {
  const [sort, setSort] = useState<SortKey>("points");

  const sorted = [...members].sort((a, b) =>
    sort === "points"
      ? b.points - a.points || a.name.localeCompare(b.name)
      : b.level - a.level || b.points - a.points,
  );

  const tabClass = (key: SortKey) =>
    [
      "rounded px-space-sm py-1 font-label-sm text-label-sm transition-colors",
      sort === key
        ? "bg-surface-container-high text-primary"
        : "text-outline hover:text-on-surface",
    ].join(" ");

  return (
    <section className="mb-space-lg flex flex-col gap-space-md">
      <div className="flex flex-col items-start justify-between gap-space-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-xl text-primary">groups</span>
            <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Mural dos Integrantes
            </h2>
          </div>
          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
            {members.length === 1
              ? "1 colaborador ativo neste squad."
              : `${members.length} colaboradores ativos neste squad.`}
          </p>
        </div>

        <div className="flex items-center gap-space-xs rounded-lg bg-surface-container-low p-1">
          <button type="button" onClick={() => setSort("points")} className={tabClass("points")}>
            Por Pontos
          </button>
          <button type="button" onClick={() => setSort("level")} className={tabClass("level")}>
            Por Nível
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
        {sorted.map((member, index) => {
          const isYou = member.id === currentUserId;
          const online = isOnline(member.lastLoginAt);

          return (
            <div
              key={member.id}
              className={[
                "relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-md transition-all hover:bg-surface-container",
                isYou ? "ring-1 ring-primary/40" : "",
              ].join(" ")}
            >
              <div>
                <div className="mb-space-sm flex items-start justify-between gap-2">
                  <div className="relative">
                    {member.avatarUrl ? (
                      <img
                        alt={`Foto de ${member.name}`}
                        src={member.avatarUrl}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={[
                          "flex h-12 w-12 items-center justify-center rounded-full font-headline-sm text-headline-sm shadow-md",
                          AVATAR_COLORS[index % AVATAR_COLORS.length],
                        ].join(" ")}
                      >
                        {getInitials(member.name)}
                      </div>
                    )}
                    <span
                      title={online ? "Online agora" : "Offline"}
                      className={[
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-surface-container-low",
                        online ? "bg-tertiary" : "bg-outline",
                      ].join(" ")}
                    />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {member.isManager && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 font-label-sm text-label-sm text-amber-300">
                        <span className="material-symbols-outlined text-xs">star</span>
                        Gestor
                      </span>
                    )}
                    {isYou && (
                      <span className="flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 font-label-sm text-label-sm text-primary">
                        <span className="material-symbols-outlined text-xs">person</span>
                        Você
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="truncate font-headline-sm text-headline-sm text-on-surface">
                  {member.name}
                </h3>
                <p className="truncate font-body-sm text-body-sm text-outline">
                  {member.jobTitle ?? "Colaborador"}
                </p>
                <div className="mt-space-xs font-label-sm text-label-sm text-primary">
                  Nível {member.level}
                </div>
              </div>

              <div className="-mx-space-md -mb-space-md mt-space-md flex items-center justify-between rounded-b-xl bg-surface-container-lowest/40 px-space-md pb-space-sm pt-space-sm">
                <span className="font-label-sm text-label-sm text-outline">
                  +{numberFormat.format(member.weekPoints)} na semana
                </span>
                <span
                  className={[
                    "font-label-lg text-label-lg",
                    isYou ? "text-primary" : "text-tertiary",
                  ].join(" ")}
                >
                  {numberFormat.format(member.points)} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
