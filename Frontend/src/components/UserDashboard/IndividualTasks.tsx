import { useEffect, useState } from "react";
import {
  formatDue,
  listTasks,
  updateTaskStatus,
  type ApiTask,
  type Reward,
  type TaskDifficulty,
} from "../../lib/tasks";
import { getErrorMessages } from "../../lib/users";

interface IndividualTasksProps {
  refreshKey: number;
  onCompleted: (info: { title: string; reward: Reward | null }) => void;
}

const DIFFICULTY: Record<TaskDifficulty, { label: string; className: string }> = {
  FACIL: {
    label: "Fácil",
    className: "bg-surface-container-highest text-tertiary-fixed",
  },
  MEDIO: {
    label: "Médio",
    className: "bg-surface-container-highest text-on-surface-variant",
  },
  DIFICIL: {
    label: "Difícil",
    className: "bg-error-container text-on-error-container",
  },
};

// o backend já devolve só a atribuição de quem está logado
function isDone(task: ApiTask) {
  return task.assignments[0]?.status === "CONCLUIDA";
}

function statusInfo(task: ApiTask) {
  const mine = task.assignments[0];

  if (mine?.status === "CONCLUIDA") {
    return { label: "Concluída", dot: "bg-tertiary", text: "text-tertiary", pulse: false };
  }
  if (task.isOverdue) {
    return { label: "Atrasada", dot: "bg-error", text: "text-error", pulse: false };
  }
  if (mine?.status === "EM_ANDAMENTO") {
    return { label: "Em andamento", dot: "bg-primary-container", text: "text-outline", pulse: true };
  }
  return { label: "Pendente", dot: "bg-outline", text: "text-outline", pulse: false };
}

export function IndividualTasks({ refreshKey, onCompleted }: IndividualTasksProps) {
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listTasks({ perPage: 20 })
      .then((result) => {
        if (!cancelled) setTasks(result.items.filter((task) => task.status !== "CANCELADA"));
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
  }, [refreshKey, reloadKey]);

  async function runAction(task: ApiTask, status: "EM_ANDAMENTO" | "CONCLUIDA") {
    setBusyId(task.id);
    setActionError(null);

    try {
      const result = await updateTaskStatus(task.id, status);

      if (status === "CONCLUIDA") {
        onCompleted({ title: task.title, reward: result.reward });
      } else {
        setReloadKey((key) => key + 1);
      }
    } catch (err) {
      setActionError(getErrorMessages(err).join(" "));
    } finally {
      setBusyId(null);
    }
  }

  // pendentes primeiro; dentro de cada grupo, a ordem de prazo do backend se mantém
  const sorted = [...tasks].sort((a, b) => Number(isDone(a)) - Number(isDone(b)));

  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-4 shadow-lg sm:p-space-lg">
      <div className="mb-space-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-primary" />
          <h2 className="font-headline-md text-lg font-bold text-on-surface sm:text-headline-md">
            Minhas Tarefas Individuais
          </h2>
        </div>

        <span className="rounded-full bg-surface-container-highest px-space-xs py-0.5 font-label-sm text-label-sm text-primary">
          Todas ({tasks.length})
        </span>
      </div>

      {actionError && (
        <p
          role="alert"
          className="mb-space-sm rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error"
        >
          {actionError}
        </p>
      )}

      {loading && tasks.length === 0 && (
        <p className="py-space-lg text-center font-body-sm text-body-sm text-outline">
          Carregando tarefas...
        </p>
      )}

      {error && (
        <div className="flex flex-col items-center gap-2 py-space-lg text-center">
          <p role="alert" className="font-body-sm text-body-sm text-error">
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
        <div className="flex flex-col items-center py-space-lg text-center">
          <span className="material-symbols-outlined mb-2 text-4xl text-outline">
            task_alt
          </span>
          <p className="font-headline-sm text-headline-sm text-on-surface">
            Nenhuma tarefa por enquanto
          </p>
          <p className="mt-1 font-body-sm text-body-sm text-outline">
            Quando o seu gestor atribuir missões, elas aparecem aqui.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-space-sm">
        {sorted.map((task) => {
          const done = isDone(task);
          const busy = busyId === task.id;
          const status = statusInfo(task);
          const difficulty = DIFFICULTY[task.difficulty];
          const mine = task.assignments[0];

          return (
            <div
              key={task.id}
              className={[
                "group flex flex-col gap-space-md rounded-xl bg-surface-container p-space-md shadow-sm transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] sm:flex-row sm:items-center sm:justify-between",
                done ? "opacity-70" : "",
              ].join(" ")}
            >
              <div className="flex flex-1 items-start gap-space-sm">
                <label
                  className={[
                    "relative mt-1 flex items-center justify-center",
                    done || busy ? "cursor-default" : "cursor-pointer",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={done}
                    disabled={done || busy}
                    onChange={() => runAction(task, "CONCLUIDA")}
                    aria-label={`Concluir a tarefa ${task.title}`}
                  />
                  <div
                    className={[
                      "flex h-5 w-5 items-center justify-center rounded-md transition-colors",
                      done
                        ? "bg-tertiary text-on-tertiary"
                        : "bg-surface-container-highest",
                      busy ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "material-symbols-outlined text-sm font-bold transition-opacity",
                        done ? "opacity-100" : "opacity-0",
                      ].join(" ")}
                    >
                      check
                    </span>
                  </div>
                </label>

                <div className="flex min-w-0 flex-col">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    {task.category && (
                      <span className="rounded-full bg-surface-container-highest px-2 py-0.5 font-label-sm text-label-sm font-semibold text-primary">
                        {task.category}
                      </span>
                    )}
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 font-label-sm text-label-sm font-semibold",
                        difficulty.className,
                      ].join(" ")}
                    >
                      {difficulty.label}
                    </span>
                    <span className="flex items-center gap-0.5 rounded-full bg-primary-container/20 px-2 py-0.5 font-label-sm text-label-sm font-bold text-primary-fixed">
                      <span className="material-symbols-outlined text-xs">
                        bolt
                      </span>
                      +{done ? (mine?.pointsAwarded ?? task.basePoints) : task.basePoints} pts
                    </span>
                  </div>

                  <h3
                    className={[
                      "font-headline-sm text-headline-sm font-semibold text-on-surface transition-colors group-hover:text-primary",
                      done ? "line-through decoration-outline/50" : "",
                    ].join(" ")}
                  >
                    {task.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-space-md gap-y-1 font-body-sm text-body-sm text-outline">
                    <span
                      className={[
                        "flex items-center gap-1",
                        task.isOverdue ? "text-error" : "",
                      ].join(" ")}
                    >
                      <span className="material-symbols-outlined text-xs">
                        schedule
                      </span>
                      Prazo: {formatDue(task.dueDate)}
                    </span>

                    <span className={["flex items-center gap-1", status.text].join(" ")}>
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          status.dot,
                          status.pulse ? "animate-ping" : "",
                        ].join(" ")}
                      />
                      {status.label}
                    </span>

                    {mine?.status === "PENDENTE" && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => runAction(task, "EM_ANDAMENTO")}
                        className="font-label-md text-label-md font-bold text-primary hover:underline disabled:opacity-50"
                      >
                        Iniciar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
