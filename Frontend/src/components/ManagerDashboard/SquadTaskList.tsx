import { useEffect, useRef, useState } from "react";
import type { SquadMember } from "../../lib/squads";
import { DIFFICULTY_LABEL, PRIORITY_LABEL } from "../../lib/taskOptions";
import {
  formatDue,
  listTasks,
  updateTaskStatus,
  type ApiTask,
  type TaskDifficulty,
} from "../../lib/tasks";
import { getErrorMessages, getInitials, type Paginated } from "../../lib/users";
import { CancelTaskModal } from "./CancelTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { TaskAssigneesModal } from "./TaskAssigneesModal";

interface SquadTaskListProps {
  members: SquadMember[];
  refreshKey: number;
  onChanged: () => void;
}

type StatusFilter = "" | "overdue" | "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDA" | "CANCELADA";

const PER_PAGE = 8;

const selectClass =
  "rounded-lg border border-outline-variant/30 bg-surface-container-lowest px-2.5 py-2 font-label-sm text-label-sm text-on-surface outline-none";

const AVATAR_COLORS = [
  "bg-primary/20 text-primary",
  "bg-secondary/20 text-secondary",
  "bg-tertiary/20 text-tertiary",
  "bg-surface-container-highest text-on-surface",
];

function taskState(task: ApiTask) {
  if (task.status === "CANCELADA") {
    return { label: "Cancelada", chip: "bg-surface-container-high text-outline" };
  }
  if (task.status === "CONCLUIDA") {
    return { label: "Concluída", chip: "bg-tertiary/15 text-tertiary" };
  }
  if (task.isOverdue) {
    return { label: "Atrasada", chip: "bg-error/15 text-error" };
  }
  if (task.status === "EM_ANDAMENTO") {
    return { label: "Em andamento", chip: "bg-primary/15 text-primary" };
  }
  return { label: "Pendente", chip: "bg-surface-container-high text-on-surface-variant" };
}

const actionClass =
  "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-lg bg-surface-container font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-variant disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface-container";

export function SquadTaskList({ members, refreshKey, onChanged }: SquadTaskListProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [difficulty, setDifficulty] = useState<"" | TaskDifficulty>("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<Paginated<ApiTask> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number | undefined>(undefined);

  const [editTarget, setEditTarget] = useState<ApiTask | null>(null);
  const [assigneesTaskId, setAssigneesTaskId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<ApiTask | null>(null);
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listTasks({
      page,
      perPage: PER_PAGE,
      search: debouncedSearch || undefined,
      difficulty: difficulty || undefined,
      ...(statusFilter === "overdue"
        ? { overdue: "true" as const }
        : statusFilter
          ? { status: statusFilter }
          : {}),
    })
      .then((result) => {
        if (!cancelled) setData(result);
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
  }, [page, debouncedSearch, statusFilter, difficulty, refreshKey, reloadKey]);

  // se a página atual deixou de existir (ex.: cancelou a última tarefa da página), volta uma
  useEffect(() => {
    if (data && data.meta.totalPages > 0 && page > data.meta.totalPages) {
      setPage(data.meta.totalPages);
    }
  }, [data, page]);

  const tasks = data?.items ?? [];
  const meta = data?.meta;
  // o modal de responsáveis lê a tarefa da lista atual, então acompanha cada recarregamento
  const assigneesTask = tasks.find((task) => task.id === assigneesTaskId) ?? null;

  function showNotice(message: string) {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 5000);
  }

  async function confirmCancel() {
    if (!cancelTarget) return;

    setCancelSubmitting(true);
    setCancelError(null);

    try {
      await updateTaskStatus(cancelTarget.id, "CANCELADA");
      showNotice(`Tarefa "${cancelTarget.title}" cancelada.`);
      setCancelTarget(null);
      onChanged();
    } catch (err) {
      setCancelError(getErrorMessages(err).join(" "));
    } finally {
      setCancelSubmitting(false);
    }
  }

  return (
    <section className="mb-space-xl overflow-hidden rounded-xl bg-surface-container-low/90 shadow-xl backdrop-blur-xl">
      <div className="flex flex-col gap-space-md border-b border-surface-container-highest/60 p-4 sm:p-space-lg">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container/30 text-secondary">
            <span className="material-symbols-outlined text-2xl">checklist</span>
          </div>

          <div>
            <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Tarefas do Squad
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Acompanhe, edite, redistribua responsáveis ou cancele tarefas
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap">
          <div className="relative min-w-[220px] flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
              search
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar tarefa pelo título..."
              className="w-full rounded-lg border border-outline-variant/30 bg-surface-container-lowest py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value as StatusFilter);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">Status (Todos)</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="overdue">Atrasadas</option>
            <option value="CONCLUIDA">Concluídas</option>
            <option value="CANCELADA">Canceladas</option>
          </select>

          <select
            value={difficulty}
            onChange={(event) => {
              setDifficulty(event.target.value as "" | TaskDifficulty);
              setPage(1);
            }}
            className={selectClass}
          >
            <option value="">Dificuldade (Todas)</option>
            <option value="FACIL">Fácil</option>
            <option value="MEDIO">Médio</option>
            <option value="DIFICIL">Difícil</option>
          </select>
        </div>
      </div>

      {notice && (
        <p
          role="status"
          className="mx-4 mt-4 rounded-lg bg-tertiary/10 px-space-md py-space-sm font-body-sm text-body-sm text-tertiary sm:mx-space-lg"
        >
          {notice}
        </p>
      )}

      {loading && tasks.length === 0 && (
        <p className="p-12 text-center font-body-sm text-body-sm text-outline">
          Carregando tarefas...
        </p>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2 p-12 text-center">
          <p role="alert" className="font-body-md text-body-md text-error">
            {error}
          </p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="rounded-lg bg-surface-container-high px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:bg-surface-variant"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">task_alt</span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhuma tarefa encontrada
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Crie uma tarefa no formulário acima ou mude os filtros.
          </p>
        </div>
      )}

      {tasks.length > 0 && (
        <div
          className={[
            "grid grid-cols-1 gap-space-md p-4 transition-opacity sm:p-space-lg xl:grid-cols-2",
            loading ? "opacity-50" : "",
          ].join(" ")}
        >
          {tasks.map((task) => {
            const state = taskState(task);
            const isOpen = task.status === "PENDENTE" || task.status === "EM_ANDAMENTO";
            const done = task.assignments.filter((a) => a.status === "CONCLUIDA").length;
            const shown = task.assignments.slice(0, 4);
            const extra = task.assignments.length - shown.length;

            return (
              <article
                key={task.id}
                className={[
                  "flex flex-col justify-between rounded-xl bg-surface-container p-space-md shadow-md",
                  task.status === "CANCELADA" ? "opacity-60" : "",
                ].join(" ")}
              >
                <div>
                  <div className="mb-space-xs flex flex-wrap items-center gap-1.5">
                    <span
                      className={[
                        "rounded px-1.5 py-0.5 font-label-sm text-label-sm font-semibold",
                        state.chip,
                      ].join(" ")}
                    >
                      {state.label}
                    </span>
                    {task.category && (
                      <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-sm text-label-sm text-primary">
                        {task.category}
                      </span>
                    )}
                    <span className="rounded bg-surface-container-highest px-1.5 py-0.5 font-label-sm text-label-sm text-on-surface-variant">
                      {DIFFICULTY_LABEL[task.difficulty]}
                    </span>
                    {task.priority === 3 && (
                      <span className="flex items-center gap-0.5 rounded bg-error-container px-1.5 py-0.5 font-label-sm text-label-sm text-on-error-container">
                        <span className="material-symbols-outlined text-xs">
                          local_fire_department
                        </span>
                        {PRIORITY_LABEL[3]}
                      </span>
                    )}
                    <span className="flex items-center gap-0.5 rounded bg-primary-container/20 px-1.5 py-0.5 font-label-sm text-label-sm font-bold text-primary-fixed">
                      <span className="material-symbols-outlined text-xs">bolt</span>+
                      {task.basePoints} pts
                    </span>
                  </div>

                  <h3 className="font-headline-sm text-headline-sm text-on-surface">{task.title}</h3>

                  {task.description && (
                    <p className="mt-1 line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-space-sm flex flex-wrap items-center justify-between gap-x-space-md gap-y-space-xs">
                    <span
                      className={[
                        "flex items-center gap-1 font-body-sm text-body-sm",
                        task.isOverdue ? "text-error" : "text-outline",
                      ].join(" ")}
                    >
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Prazo: {formatDue(task.dueDate)}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {shown.map((assignment, index) => (
                          <span
                            key={assignment.id}
                            title={`${assignment.user.name}${assignment.status === "CONCLUIDA" ? " (concluiu)" : ""}`}
                            className={[
                              "flex h-7 w-7 items-center justify-center rounded-full font-label-sm text-[10px] font-bold ring-2 ring-surface-container",
                              assignment.status === "CONCLUIDA"
                                ? "bg-tertiary text-surface-container-lowest"
                                : AVATAR_COLORS[index % AVATAR_COLORS.length],
                            ].join(" ")}
                          >
                            {getInitials(assignment.user.name)}
                          </span>
                        ))}
                        {extra > 0 && (
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-highest font-label-sm text-[10px] text-primary ring-2 ring-surface-container">
                            +{extra}
                          </span>
                        )}
                      </div>
                      <span className="font-label-sm text-label-sm text-outline">
                        {done}/{task.assignments.length} concluíram
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md flex gap-2 border-t border-outline-variant/20 pt-space-sm">
                  <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => setEditTarget(task)}
                    title={isOpen ? "Editar tarefa" : "Só tarefas em aberto podem ser editadas"}
                    className={actionClass}
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssigneesTaskId(task.id)}
                    className={actionClass}
                  >
                    <span className="material-symbols-outlined text-lg">group</span>
                    Responsáveis
                  </button>

                  <button
                    type="button"
                    disabled={!isOpen}
                    onClick={() => {
                      setCancelError(null);
                      setCancelTarget(task);
                    }}
                    title={isOpen ? "Cancelar tarefa" : "Só tarefas em aberto podem ser canceladas"}
                    className={[actionClass, "hover:text-error"].join(" ")}
                  >
                    <span className="material-symbols-outlined text-lg">cancel</span>
                    Cancelar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex flex-col items-center justify-between gap-2 border-t border-surface-container-highest/60 bg-surface-container-low/50 p-space-md text-center font-body-sm text-body-sm text-outline sm:flex-row sm:text-left">
        <div>
          Exibindo {tasks.length} de {meta?.total ?? 0} {meta?.total === 1 ? "tarefa" : "tarefas"}
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Página anterior"
              disabled={page <= 1}
              onClick={() => setPage((current) => current - 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            <span className="px-2 font-label-md text-label-md text-on-surface">
              {page} / {meta.totalPages}
            </span>

            <button
              type="button"
              aria-label="Próxima página"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
              className="flex h-8 w-8 items-center justify-center rounded bg-surface-container text-outline disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        )}
      </div>

      <EditTaskModal
        task={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={(message) => {
          setEditTarget(null);
          showNotice(message);
          onChanged();
        }}
      />

      <TaskAssigneesModal
        task={assigneesTask}
        members={members}
        onClose={() => setAssigneesTaskId(null)}
        onChanged={(message) => {
          showNotice(message);
          onChanged();
        }}
      />

      <CancelTaskModal
        task={cancelTarget}
        submitting={cancelSubmitting}
        error={cancelError}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
      />
    </section>
  );
}
