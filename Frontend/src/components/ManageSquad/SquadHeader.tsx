import type { Roster } from "../../lib/squads";
import { SECTORS } from "../../lib/users";

interface SquadHeaderProps {
  squad: Roster["squad"];
  stats: Roster["stats"];
  search: string;
  onSearchChange: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  onAddMember: () => void;
}

const numberFormat = new Intl.NumberFormat("pt-BR");

export function SquadHeader({
  squad,
  stats,
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  onAddMember,
}: SquadHeaderProps) {
  return (
    <section className="relative mb-6 overflow-hidden rounded-2xl bg-surface-container-low p-4 shadow-xl sm:mb-8 sm:p-space-lg">
      <div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-tertiary/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-5">
          <div className="relative mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high shadow-lg sm:mb-0 sm:h-20 sm:w-20">
            <span
              className="material-symbols-outlined text-4xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              shield
            </span>

            <span className="absolute -bottom-1 -right-1 rounded-full bg-tertiary-container px-1.5 py-0.5 font-label-sm text-label-sm font-bold uppercase tracking-wider text-on-tertiary">
              {squad.isActive ? "Ativo" : "Inativo"}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <h1 className="font-headline-md text-lg text-on-surface sm:font-headline-lg sm:text-headline-lg">
                Squad {squad.name}
              </h1>

              <span className="rounded-full bg-surface-container-highest px-2.5 py-0.5 font-label-sm text-label-sm tracking-wide text-secondary">
                ID: #SQ-{squad.id}
              </span>
            </div>

            <p className="mt-1.5 max-w-2xl font-body-sm text-body-sm text-on-surface-variant sm:font-body-md sm:text-body-md">
              {squad.description ?? "Este squad ainda não tem uma descrição."}
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-3 xl:w-auto">
          <div className="flex items-center gap-3 rounded-xl bg-surface-container px-3.5 py-2.5 shadow-sm sm:px-4 sm:py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-primary">
              <span className="material-symbols-outlined text-2xl">group</span>
            </div>

            <div className="min-w-0">
              <p className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Membros Ativos
              </p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {stats.memberCount}{" "}
                {stats.memberCount === 1 ? "Colaborador" : "Colaboradores"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface-container px-3.5 py-2.5 shadow-sm sm:px-4 sm:py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-secondary">
              <span className="material-symbols-outlined text-2xl">analytics</span>
            </div>

            <div className="min-w-0">
              <p className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Média por Membro
              </p>
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {numberFormat.format(stats.averagePoints)} pts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-surface-container px-3.5 py-2.5 shadow-sm sm:px-4 sm:py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container-high text-tertiary">
              <span className="material-symbols-outlined text-2xl">schedule</span>
            </div>

            <div className="min-w-0">
              <p className="truncate font-label-sm text-label-sm uppercase tracking-wider text-outline">
                Entregas no Prazo
              </p>
              <p className="font-headline-sm text-headline-sm font-bold text-tertiary">
                {stats.onTimeRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5 flex flex-col gap-3 rounded-xl bg-surface-container-lowest/40 p-3.5 sm:mt-6 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl text-outline">
              search
            </span>
            <input
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar membros por nome, cargo ou e-mail..."
              className="h-11 w-full rounded-xl bg-surface-container-high pl-11 pr-4 font-body-sm text-body-sm text-on-surface outline-none transition-all placeholder:text-outline focus:bg-surface-container-highest sm:font-body-md sm:text-body-md"
            />
          </div>

          <select
            value={department}
            onChange={(event) => onDepartmentChange(event.target.value)}
            className="h-11 cursor-pointer rounded-xl bg-surface-container-high px-3 font-label-md text-label-md text-on-surface outline-none sm:px-4"
          >
            <option value="all">Todos os Setores</option>
            {SECTORS.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onAddMember}
          className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-primary-container px-5 font-headline-sm text-headline-sm text-on-primary-container shadow-[0_0_18px_rgba(6,182,212,0.35)] transition-all hover:bg-primary hover:text-on-primary sm:w-auto"
        >
          <span className="material-symbols-outlined text-lg">person_add</span>
          <span>Adicionar Membro ao Squad</span>
        </button>
      </div>
    </section>
  );
}
