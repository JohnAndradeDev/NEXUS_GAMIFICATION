import { useEffect, useState } from "react";
import { awardAchievement, type AdminAchievement } from "../../lib/achievements";
import { getErrorMessages, getInitials, listUsers, type ApiUser } from "../../lib/users";

interface AchievementAwardModalProps {
  achievement: AdminAchievement | null;
  onClose: () => void;
  onAwarded: (message: string) => void;
}

// O conteúdo fica em outro componente para o estado reiniciar a cada abertura
export function AchievementAwardModal(props: AchievementAwardModalProps) {
  if (!props.achievement) return null;

  return <AwardPanel {...props} achievement={props.achievement} />;
}

function AwardPanel({
  achievement,
  onClose,
  onAwarded,
}: AchievementAwardModalProps & { achievement: AdminAchievement }) {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ApiUser | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    listUsers({ search: debounced, status: "ACTIVE", sort: "name-asc", perPage: 8 })
      .then((result) => {
        // administradores não têm pontuação nem conquistas
        if (!cancelled) setUsers(result.items.filter((user) => user.role !== "ADMIN"));
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
  }, [debounced]);

  async function handleConfirm() {
    if (!selected) return;

    setSubmitting(true);
    setError(null);

    try {
      const result = await awardAchievement(achievement.id, selected.id);
      const extra =
        result.others.length > 0
          ? ` O bônus liberou também: ${result.others.map((item) => item.name).join(", ")}.`
          : "";
      onAwarded(`${result.userName} recebeu a conquista ${achievement.name}.${extra}`);
    } catch (err) {
      setError(getErrorMessages(err).join(" "));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg">
          <div className="mb-space-md flex items-start justify-between gap-space-sm">
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  {achievement.icon ?? "military_tech"}
                </span>
              </div>
              <div className="min-w-0">
                <h4 className="font-headline-md text-headline-md text-on-surface">Conceder conquista</h4>
                <span className="block truncate font-body-sm text-body-sm text-outline">
                  {achievement.name}
                  {achievement.pointsBonus > 0 && ` • +${achievement.pointsBonus} pts`}
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Fechar"
              onClick={onClose}
              className="shrink-0 rounded-lg p-1 text-outline hover:text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="relative mb-space-sm">
            <span className="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xl text-outline">
              search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar colaborador..."
              className="h-11 w-full rounded-xl bg-surface-container pl-10 pr-3 font-body-md text-body-md text-on-surface outline-none focus:bg-surface-container-highest"
            />
          </div>

          <div className="max-h-64 space-y-2 overflow-y-auto">
            {loading && users.length === 0 && (
              <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
                Buscando colaboradores...
              </p>
            )}

            {!loading && users.length === 0 && (
              <p className="py-space-md text-center font-body-sm text-body-sm text-outline">
                Nenhum colaborador encontrado.
              </p>
            )}

            {users.map((user) => {
              const isSelected = selected?.id === user.id;

              return (
                <button
                  key={user.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelected(user)}
                  className={[
                    "flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-all",
                    isSelected
                      ? "bg-primary/15 ring-1 ring-primary/50"
                      : "bg-surface-container hover:bg-surface-container-highest",
                  ].join(" ")}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
                    {isSelected ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-label-md text-label-md text-on-surface">{user.name}</p>
                    <p className="truncate font-label-sm text-label-sm text-outline">
                      {[user.jobTitle ?? "Colaborador", user.squad?.name].filter(Boolean).join(" • ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {error && (
            <p role="alert" className="mt-space-sm font-body-sm text-body-sm text-error">
              {error}
            </p>
          )}

          <div className="mt-space-md flex items-center justify-end gap-space-sm">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg bg-surface-container px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selected || submitting}
              className="rounded-lg bg-primary-container px-space-md py-space-xs font-label-md text-label-md text-on-primary-container shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Concedendo..." : "Conceder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
