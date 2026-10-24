import { useState } from "react";
import type { SquadMember } from "../../lib/squads";
import { addTaskAssignees, removeTaskAssignee, type ApiTask, type AssignmentStatus } from "../../lib/tasks";
import { getErrorMessages, getInitials } from "../../lib/users";

interface TaskAssigneesModalProps {
  task: ApiTask | null;
  members: SquadMember[];
  onClose: () => void;
  // chamado depois de adicionar ou remover; o pai recarrega a lista e o modal acompanha
  onChanged: (message: string) => void;
}

const STATUS_STYLE: Record<AssignmentStatus, { label: string; chip: string }> = {
  PENDENTE: { label: "Pendente", chip: "bg-surface-container-high text-on-surface-variant" },
  EM_ANDAMENTO: { label: "Em andamento", chip: "bg-primary/15 text-primary" },
  CONCLUIDA: { label: "Concluída", chip: "bg-tertiary/15 text-tertiary" },
  ATRASADA: { label: "Atrasada", chip: "bg-error/15 text-error" },
};

export function TaskAssigneesModal(props: TaskAssigneesModalProps) {
  if (!props.task) return null;

  return <TaskAssigneesPanel {...props} task={props.task} />;
}

function TaskAssigneesPanel({
  task,
  members,
  onClose,
  onChanged,
}: TaskAssigneesModalProps & { task: ApiTask }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [busyId, setBusyId] = useState<number | "add" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const open = task.status === "PENDENTE" || task.status === "EM_ANDAMENTO";
  const assignedIds = new Set(task.assignments.map((a) => a.userId));
  const available = members.filter((member) => !assignedIds.has(member.id));
  // some da lista quem já foi adicionado e a seleção continua coerente depois do recarregamento
  const validSelected = selected.filter((id) => available.some((member) => member.id === id));

  function toggle(id: number) {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function handleRemove(userId: number, name: string) {
    setBusyId(userId);
    setError(null);

    try {
      await removeTaskAssignee(task.id, userId);
      onChanged(`${name} foi removido da tarefa.`);
    } catch (err) {
      setError(getErrorMessages(err).join(" "));
    } finally {
      setBusyId(null);
    }
  }

  async function handleAdd() {
    if (validSelected.length === 0) return;

    setBusyId("add");
    setError(null);

    try {
      await addTaskAssignees(task.id, validSelected);
      setSelected([]);
      onChanged(
        validSelected.length === 1
          ? "1 responsável adicionado à tarefa."
          : `${validSelected.length} responsáveis adicionados à tarefa.`,
      );
    } catch (err) {
      setError(getErrorMessages(err).join(" "));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-lg rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg">
          <div className="mb-space-md flex items-start justify-between gap-space-sm">
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
                <span className="material-symbols-outlined text-2xl">groups</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-headline-md text-headline-md text-on-surface">Responsáveis</h4>
                <span className="block truncate font-body-sm text-body-sm text-outline">
                  {task.title}
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

          <div className="space-y-2">
            {task.assignments.map((assignment) => {
              const style = STATUS_STYLE[assignment.status];
              const removable = open && assignment.status !== "CONCLUIDA" && task.assignments.length > 1;

              return (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-surface-container p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-space-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-on-secondary">
                      {getInitials(assignment.user.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-label-md text-label-md text-on-surface">
                        {assignment.user.name}
                      </p>
                      <span
                        className={[
                          "inline-block rounded px-1.5 py-0.5 font-label-sm text-label-sm",
                          style.chip,
                        ].join(" ")}
                      >
                        {style.label}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!removable || busyId !== null}
                    onClick={() => handleRemove(assignment.userId, assignment.user.name)}
                    title={
                      assignment.status === "CONCLUIDA"
                        ? "Quem já concluiu não pode ser removido"
                        : task.assignments.length <= 1
                          ? "A tarefa precisa de ao menos um responsável"
                          : `Remover ${assignment.user.name}`
                    }
                    className="shrink-0 rounded-lg p-1.5 text-outline-variant transition-colors hover:bg-surface-container-high hover:text-error disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-outline-variant"
                  >
                    <span className="material-symbols-outlined text-lg">person_remove</span>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-space-md border-t border-outline-variant/20 pt-space-md">
            <p className="mb-space-xs font-label-md text-label-md text-on-surface">
              Adicionar responsáveis
            </p>

            {!open ? (
              <p className="font-body-sm text-body-sm text-outline">
                Esta tarefa está {task.status === "CANCELADA" ? "cancelada" : "concluída"} e não
                aceita mudanças nos responsáveis.
              </p>
            ) : available.length === 0 ? (
              <p className="font-body-sm text-body-sm text-outline">
                Todos os membros ativos do squad já são responsáveis por esta tarefa.
              </p>
            ) : (
              <>
                <div className="flex max-h-48 flex-wrap gap-space-xs overflow-y-auto">
                  {available.map((member) => {
                    const isSelected = validSelected.includes(member.id);

                    return (
                      <button
                        key={member.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => toggle(member.id)}
                        className={[
                          "flex items-center gap-space-sm rounded-xl p-2 text-left transition-all",
                          isSelected
                            ? "bg-primary/15 ring-1 ring-primary/50"
                            : "bg-surface-container-highest/60 hover:bg-surface-container-highest",
                        ].join(" ")}
                      >
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-on-secondary">
                          {isSelected ? (
                            <span className="material-symbols-outlined text-sm">check</span>
                          ) : (
                            getInitials(member.name)
                          )}
                        </div>
                        <span className="font-label-md text-label-md text-on-surface">
                          {member.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={validSelected.length === 0 || busyId !== null}
                  className="mt-space-sm w-full rounded-lg bg-primary-container px-space-md py-2 font-label-md text-label-md text-on-primary-container shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {busyId === "add"
                    ? "Adicionando..."
                    : validSelected.length > 0
                      ? `Adicionar selecionados (${validSelected.length})`
                      : "Adicionar selecionados"}
                </button>
              </>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-space-sm font-body-sm text-body-sm text-error">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
