import type { RankingPeriod } from "../../lib/rankings";

export type RankingTab = "users" | "squads";
export type RankingScope = "all" | "mine";

const PERIODS: { value: RankingPeriod; label: string }[] = [
  { value: "week", label: "Últimos 7 dias" },
  { value: "month", label: "Este mês" },
  { value: "all", label: "Geral" },
];

interface RankingControlsProps {
  tab: RankingTab;
  onTab: (tab: RankingTab) => void;
  period: RankingPeriod;
  onPeriod: (period: RankingPeriod) => void;
  scope: RankingScope;
  onScope: (scope: RankingScope) => void;
  canFilterBySquad: boolean;
}

const segment = (active: boolean) =>
  [
    "rounded-lg px-space-md py-2 font-label-md text-label-md transition-all",
    active
      ? "bg-primary-container text-on-primary-container shadow-[0_0_12px_rgba(6,182,212,0.25)]"
      : "text-on-surface-variant hover:text-on-surface",
  ].join(" ");

export function RankingControls({
  tab,
  onTab,
  period,
  onPeriod,
  scope,
  onScope,
  canFilterBySquad,
}: RankingControlsProps) {
  return (
    <div className="mb-space-lg flex flex-col gap-space-sm lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full gap-1 rounded-xl bg-surface-container-low p-1 lg:w-auto">
        <button
          type="button"
          aria-pressed={tab === "users"}
          onClick={() => onTab("users")}
          className={[segment(tab === "users"), "flex flex-1 items-center justify-center gap-1.5"].join(" ")}
        >
          <span className="material-symbols-outlined text-lg">person</span>
          Colaboradores
        </button>
        <button
          type="button"
          aria-pressed={tab === "squads"}
          onClick={() => onTab("squads")}
          className={[segment(tab === "squads"), "flex flex-1 items-center justify-center gap-1.5"].join(" ")}
        >
          <span className="material-symbols-outlined text-lg">groups</span>
          Squads
        </button>
      </div>

      <div className="flex flex-col gap-space-sm sm:flex-row sm:items-center">
        {tab === "users" && canFilterBySquad && (
          <select
            value={scope}
            onChange={(event) => onScope(event.target.value as RankingScope)}
            aria-label="Filtrar por squad"
            className="h-10 rounded-xl bg-surface-container-low px-3 font-label-md text-label-md text-on-surface outline-none"
          >
            <option value="all">Toda a empresa</option>
            <option value="mine">Só o meu squad</option>
          </select>
        )}

        <div className="flex w-full gap-1 rounded-xl bg-surface-container-low p-1 sm:w-auto">
          {PERIODS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={period === item.value}
              onClick={() => onPeriod(item.value)}
              className={[segment(period === item.value), "flex-1 whitespace-nowrap sm:flex-none"].join(" ")}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
