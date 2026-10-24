import { useState } from "react";
import { CATEGORIES, DIFFICULTIES, PRIORITIES } from "../../lib/taskOptions";
import { updateTask, type ApiTask, type TaskDifficulty, type UpdateTaskInput } from "../../lib/tasks";
import { getErrorMessages } from "../../lib/users";

interface EditTaskModalProps {
  task: ApiTask | null;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const inputClass =
  "w-full rounded-xl bg-surface-container-highest/60 font-body-md text-body-md text-on-surface outline-none transition-all hover:bg-surface-container-highest focus:bg-surface-container-highest focus:shadow-[0_0_0_2px_rgba(76,215,246,0.3)] disabled:opacity-60";

// data local no formato AAAA-MM-DD, o que o input type="date" espera
function toDateInput(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("sv-SE") : "";
}

// O formulário fica em outro componente para o estado reiniciar a cada abertura
export function EditTaskModal(props: EditTaskModalProps) {
  if (!props.task) return null;

  return <EditTaskForm {...props} task={props.task} />;
}

function EditTaskForm({ task, onClose, onSaved }: EditTaskModalProps & { task: ApiTask }) {
  const initial = {
    title: task.title,
    description: task.description ?? "",
    category: task.category,
    difficulty: task.difficulty,
    priority: task.priority,
    startDate: toDateInput(task.startDate),
    dueDate: toDateInput(task.dueDate),
  };

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // depois que alguém concluiu, os pontos já foram pagos: a dificuldade fica travada
  const difficultyLocked = task.assignments.some((a) => a.status === "CONCLUIDA");

  // categorias fora da lista padrão (criadas por outras vias) continuam selecionáveis
  const categories =
    task.category && !CATEGORIES.some((item) => item.name === task.category)
      ? [...CATEGORIES, { name: task.category, icon: "label" }]
      : CATEGORIES;

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);

    // só envia o que mudou: assim editar o título de uma tarefa atrasada não exige novo prazo
    const patch: UpdateTaskInput = {};
    if (form.title.trim() !== initial.title) patch.title = form.title.trim();
    if (form.description.trim() !== initial.description.trim()) {
      patch.description = form.description.trim() || null;
    }
    if (form.category !== initial.category) patch.category = form.category;
    if (form.difficulty !== initial.difficulty) patch.difficulty = form.difficulty;
    if (form.priority !== initial.priority) patch.priority = form.priority;
    if (form.startDate !== initial.startDate) {
      patch.startDate = form.startDate ? new Date(`${form.startDate}T00:00:00`).toISOString() : null;
    }
    if (form.dueDate !== initial.dueDate) {
      patch.dueDate = new Date(`${form.dueDate}T23:59:59`).toISOString();
    }

    if (Object.keys(patch).length === 0) {
      onClose();
      return;
    }

    setSubmitting(true);

    try {
      await updateTask(task.id, patch);
      onSaved(`Tarefa "${form.title.trim()}" atualizada com sucesso.`);
    } catch (err) {
      setErrors(getErrorMessages(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-70 overflow-y-auto bg-surface-container-lowest/80 backdrop-blur-md">
      <div className="flex min-h-full items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl rounded-xl border border-outline-variant/30 bg-surface-container-high p-space-md shadow-2xl sm:p-space-lg"
        >
          <div className="mb-space-md flex items-center gap-space-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary">
              <span className="material-symbols-outlined text-2xl">edit_note</span>
            </div>

            <div>
              <h4 className="font-headline-md text-headline-md text-on-surface">Editar tarefa</h4>
              <span className="font-body-sm text-body-sm text-outline">
                Os responsáveis são gerenciados em "Responsáveis"
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <div className="flex flex-col gap-space-xs sm:col-span-2">
              <label htmlFor="edit-task-title" className="font-label-md text-label-md text-on-surface">
                Título da Tarefa <span className="text-primary">*</span>
              </label>
              <input
                id="edit-task-title"
                required
                minLength={3}
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className={[inputClass, "h-11 px-space-md"].join(" ")}
              />
            </div>

            <div className="flex flex-col gap-space-xs sm:col-span-2">
              <label htmlFor="edit-task-description" className="font-label-md text-label-md text-on-surface">
                Descrição
              </label>
              <textarea
                id="edit-task-description"
                rows={4}
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className={[inputClass, "resize-none p-space-md"].join(" ")}
              />
            </div>

            <div className="flex flex-col gap-space-xs sm:col-span-2">
              <label className="font-label-md text-label-md text-on-surface">Categoria</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={form.category === item.name}
                    onClick={() =>
                      setField("category", form.category === item.name ? null : item.name)
                    }
                    className={[
                      "flex items-center gap-1 rounded-lg px-2.5 py-1 font-label-md text-label-md transition-all",
                      form.category === item.name
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface",
                    ].join(" ")}
                  >
                    <span className="material-symbols-outlined text-sm">{item.icon}</span>
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-space-xs sm:col-span-2">
              <label className="font-label-md text-label-md text-on-surface">
                Dificuldade & Recompensa
              </label>
              <div className="grid grid-cols-1 gap-space-xs sm:grid-cols-3">
                {DIFFICULTIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    disabled={difficultyLocked}
                    aria-pressed={form.difficulty === item.value}
                    onClick={() => setField("difficulty", item.value as TaskDifficulty)}
                    className={[
                      "rounded-xl p-space-sm text-left transition-all disabled:cursor-not-allowed disabled:opacity-60",
                      form.difficulty === item.value
                        ? "bg-secondary-container shadow-[0_0_18px_rgba(87,27,193,0.45)]"
                        : "bg-surface-container-highest/50 hover:bg-surface-container-highest",
                    ].join(" ")}
                  >
                    <div className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                      {item.label}
                    </div>
                    <div className="mt-1 font-headline-sm text-headline-sm text-on-surface">
                      +{item.points} pts
                    </div>
                  </button>
                ))}
              </div>
              {difficultyLocked && (
                <p className="font-body-sm text-body-sm text-outline">
                  Alguém já concluiu esta tarefa, então a dificuldade não pode mais mudar.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-space-xs">
              <label htmlFor="edit-task-start" className="font-label-sm text-label-sm text-outline">
                Data de Início
              </label>
              <input
                id="edit-task-start"
                type="date"
                max={form.dueDate || undefined}
                value={form.startDate}
                onChange={(event) => setField("startDate", event.target.value)}
                className={[inputClass, "h-10 px-space-sm font-body-sm text-body-sm"].join(" ")}
              />
            </div>

            <div className="flex flex-col gap-space-xs">
              <label htmlFor="edit-task-due" className="font-label-sm text-label-sm text-outline">
                Prazo Final <span className="text-primary">*</span>
              </label>
              <input
                id="edit-task-due"
                type="date"
                required
                min={form.startDate || undefined}
                value={form.dueDate}
                onChange={(event) => setField("dueDate", event.target.value)}
                className={[inputClass, "h-10 px-space-sm font-body-sm text-body-sm text-primary"].join(" ")}
              />
            </div>

            <div className="flex flex-col gap-space-xs sm:col-span-2">
              <label className="font-label-sm text-label-sm text-outline">Prioridade da Demanda</label>
              <div className="grid grid-cols-3 gap-space-xs text-center font-label-md text-label-md">
                {PRIORITIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={form.priority === item.value}
                    onClick={() => setField("priority", item.value)}
                    className={[
                      "rounded-lg py-1.5 transition-all",
                      form.priority === item.value
                        ? "bg-error-container font-headline-sm text-headline-sm text-on-error-container"
                        : "bg-surface-container-highest text-outline hover:text-on-surface",
                    ].join(" ")}
                  >
                    {item.value === 3 && (
                      <span className="material-symbols-outlined mr-1 align-middle text-sm">
                        local_fire_department
                      </span>
                    )}
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {errors.length > 0 && (
            <ul
              role="alert"
              className="mt-space-md space-y-1 rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error"
            >
              {errors.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
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
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-primary px-space-md py-space-xs font-label-md text-label-md text-on-primary shadow-md hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
