import { useEffect, useState } from "react";
import { getAdminMetrics, type AdminMetricsData } from "../../lib/users";

const numberFormat = new Intl.NumberFormat("pt-BR");
const compactFormat = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface AdminMetricsProps {
  refreshKey?: number;
}

export function AdminMetrics({ refreshKey = 0 }: AdminMetricsProps) {
  const [m, setM] = useState<AdminMetricsData | null>(null);

  useEffect(() => {
    let cancelled = false;

    getAdminMetrics()
      .then((data) => {
        if (!cancelled) setM(data.metrics);
      })
      .catch(() => {
        // mantém os valores anteriores (ou "—") se a consulta falhar
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const dash = "—";
  const n = (value?: number) =>
    value === undefined ? dash : numberFormat.format(value);

  return (
    <section className="mb-space-xl grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      <div className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Total Usuários
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">group</span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          {n(m?.usersTotal)}
        </span>

        <div className="mt-1 flex items-center gap-1 text-tertiary">
          <span className="material-symbols-outlined text-sm">trending_up</span>
          <span className="font-label-sm text-label-sm">{m ? `+${m.newUsersThisMonth} no mês` : dash}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Ativos
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              how_to_reg
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-tertiary-fixed-dim sm:text-metric-display">
          {n(m?.usersActive)}
        </span>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-tertiary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-tertiary" />
          </span>

          <span className="font-label-sm text-label-sm text-on-surface-variant">
            {m ? `${m.activeRate}% do total` : dash}
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Desativados
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-outline sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              person_off
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface-variant sm:text-metric-display">
          {n(m?.usersInactive)}
        </span>

        <div className="mt-1 flex items-center gap-1 text-outline">
          <span className="material-symbols-outlined text-sm">archive</span>
          <span className="font-label-sm text-label-sm">Preservados</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Squads
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary-fixed-dim sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">hub</span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          {n(m?.squads)}
        </span>

        <div className="mt-1 flex items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-sm">diversity_2</span>
          <span className="font-label-sm text-label-sm">{m ? `${m.membersPerSquad} membros/squad` : dash}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Missões Criadas
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-secondary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              assignment
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          {n(m?.tasksTotal)}
        </span>

        <div className="mt-1 flex items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">cycle</span>
          <span className="font-label-sm text-label-sm">Total acumulado</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Concluídas
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              task_alt
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-tertiary sm:text-metric-display">
          {n(m?.tasksCompleted)}
        </span>

        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-container-lowest">
          <div
            className="h-full rounded-full bg-tertiary"
            style={{ width: `${m?.completionRate ?? 0}%` }}
          />
        </div>

        <span className="mt-1 block font-label-sm text-label-sm text-tertiary">
          {m ? `${m.completionRate}% taxa` : dash}
        </span>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            Engajamento
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">
              vital_signs
            </span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-on-surface sm:text-metric-display">
          {m ? `${m.engagementRate}%` : dash}
        </span>

        <div className="mt-1 flex items-center gap-1 text-primary">
          <span className="material-symbols-outlined text-sm">insights</span>
          <span className="font-label-sm text-label-sm">logins em 7 dias</span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3 shadow-md transition-colors hover:bg-surface-container-high sm:p-space-md">
        <div className="mb-space-sm flex items-center justify-between">
          <span className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
            XP Global
          </span>

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-container/20 text-primary sm:h-8 sm:w-8">
            <span className="material-symbols-outlined text-base">bolt</span>
          </div>
        </div>

        <span className="font-metric-display text-xl text-primary sm:text-metric-display">
          {m ? compactFormat.format(m.xpTotal) : dash}
        </span>

        <div className="mt-1 flex items-center gap-1 text-secondary">
          <span className="material-symbols-outlined text-sm">stars</span>
          <span className="font-label-sm text-label-sm">pontos acumulados</span>
        </div>
      </div>
    </section>
  );
}
