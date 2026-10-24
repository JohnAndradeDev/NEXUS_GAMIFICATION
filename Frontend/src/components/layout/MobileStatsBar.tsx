import { useAuth } from "../../contexts/AuthContext";
import { usePoints } from "../../contexts/PointsContext";

export function MobileStatsBar() {
  const { user } = useAuth();
  const { summary } = usePoints();

  if (!user) return null;

  return (
    <div className="fixed left-0 right-0 top-16 z-30 flex items-center justify-around gap-2 overflow-x-auto border-t border-surface-container-high bg-surface-container-lowest/95 px-4 py-1.5 text-xs backdrop-blur-md md:hidden">
      <div className="flex shrink-0 items-center gap-1 text-on-surface">
        <span className="material-symbols-outlined text-sm text-primary">
          bolt
        </span>
        <span className="font-label-sm">
          {user.experience.toLocaleString("pt-BR")} XP
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1 text-on-surface">
        <span className="material-symbols-outlined text-sm text-error">
          local_fire_department
        </span>
        <span className="font-label-sm">
          {summary ? `${summary.streakDays} ${summary.streakDays === 1 ? "Dia" : "Dias"}` : "—"}
        </span>
      </div>
    </div>
  );
}
