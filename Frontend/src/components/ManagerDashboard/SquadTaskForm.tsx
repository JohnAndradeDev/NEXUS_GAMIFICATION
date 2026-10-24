import { useState } from "react";
import type { SquadMember } from "../../lib/squads";
import { createTask, type TaskDifficulty } from "../../lib/tasks";
import { getErrorMessages, getInitials } from "../../lib/users";

const CATEGORIES = [
  { name: "DevOps", icon: "dns" },
  { name: "Backend", icon: "terminal" },
  { name: "Frontend", icon: "web" },
  { name: "QA", icon: "bug_report" },
];

// espelha a regra do backend: 5 / 10 / 15 pontos, e 1 ponto = 1 XP
const DIFFICULTIES: { value: TaskDifficulty; label: string; points: number }[] = [
  { value: "FACIL", label: "Fácil", points: 5 },
  { value: "MEDIO", label: "Médio", points: 10 },
  { value: "DIFICIL", label: "Difícil", points: 15 },
];

const PRIORITIES = [
  { value: 1, label: "Baixa" },
  { value: 2, label: "Média" },
  { value: 3, label: "Alta" },
];

interface FormState {
  title: string;
  description: string;
  category: string | null;
  difficulty: TaskDifficulty;
  priority: number;
  startDate: string;
  dueDate: string;
  assigneeIds: number[];
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  category: null,
  difficulty: "MEDIO",
  priority: 2,
  startDate: "",
  dueDate: "",
  assigneeIds: [],
};

const inputClass =
  "w-full rounded-xl bg-surface-container-highest/60 font-body-md text-body-md text-on-surface outline-none transition-all hover:bg-surface-container-highest focus:bg-surface-container-highest focus:shadow-[0_0_0_2px_rgba(76,215,246,0.3)]";

interface SquadTaskFormProps {
  members: SquadMember[];
  onCreated: () => void;
}

export function SquadTaskForm({ members, onCreated }: SquadTaskFormProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const today = new Date().toLocaleDateString("sv-SE"); // AAAA-MM-DD

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleAssignee(id: number) {
    setForm((current) => ({
      ...current,
      assigneeIds: current.assigneeIds.includes(id)
        ? current.assigneeIds.filter((item) => item !== id)
        : [...current.assigneeIds, id],
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setErrors([]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors([]);

    if (form.assigneeIds.length === 0) {
      setErrors(["Selecione ao menos um responsável."]);
      return;
    }

    setStatus("loading");

    try {
      await createTask({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        category: form.category ?? undefined,
        difficulty: form.difficulty,
        priority: form.priority,
        startDate: form.startDate ? new Date(`${form.startDate}T00:00:00`).toISOString() : undefined,
        dueDate: new Date(`${form.dueDate}T23:59:59`).toISOString(),
        assigneeIds: form.assigneeIds,
      });

      setForm(EMPTY_FORM);
      setStatus("success");
      onCreated();
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      setErrors(getErrorMessages(err));
      setStatus("idle");
    }
  }

  return (
    <section
      id="squad-task-form"
      className="relative mb-space-xl overflow-hidden rounded-xl bg-surface-container-low/90 p-4 shadow-xl backdrop-blur-xl sm:p-space-lg"
    >
      <div className="absolute left-0 right-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary-container to-transparent" />

      <div className="mb-space-lg flex flex-col justify-between gap-2 border-b border-surface-container-highest/50 pb-space-md sm:flex-row sm:items-center">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary shadow-inner">
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </div>

          <div>
            <h2 className="font-headline-md text-lg text-on-surface sm:text-headline-md">
              Criar Nova Tarefa para o Squad
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Defina escopo, responsáveis e recompensa por complexidade técnica.
            </p>
          </div>
        </div>

        <span className="self-start rounded-full bg-surface-container-highest px-space-sm py-1 font-label-sm text-label-sm uppercase tracking-wider text-primary sm:self-auto">
          Modo Squad Lead
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-space-md sm:gap-space-lg md:grid-cols-2 lg:grid-cols-3"
      >
        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-3">
          <label htmlFor="task-title" className="flex items-center justify-between font-label-md text-label-md text-on-surface">
            <span>
              Título da Tarefa <span className="text-primary">*</span>
            </span>
            <span className="hidden font-body-sm text-body-sm text-outline sm:inline">
              Objetivo claro e acionável
            </span>
          </label>

          <input
            id="task-title"
            required
            minLength={3}
            value={form.title}
            onChange={(event) => setField("title", event.target.value)}
            placeholder="Ex: Refatorar pipeline de deploy seguro em staging"
            className={[inputClass, "h-11 px-space-md"].join(" ")}
          />
        </div>

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-2">
          <label htmlFor="task-description" className="font-label-md text-label-md text-on-surface">
            Descrição Detalhada & Critérios
          </label>

          <textarea
            id="task-description"
            rows={4}
            value={form.description}
            onChange={(event) => setField("description", event.target.value)}
            placeholder="Escopo, critérios de aceite e links úteis..."
            className={[inputClass, "resize-none p-space-md"].join(" ")}
          />
        </div>

        <div className="flex flex-col gap-space-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Categoria de Missão
          </label>

          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((item) => (
              <button
                key={item.name}
                type="button"
                aria-pressed={form.category === item.name}
                onClick={() => setField("category", form.category === item.name ? null : item.name)}
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

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface">
              Responsáveis <span className="text-primary">*</span>
            </label>
            <button
              type="button"
              onClick={() =>
                setField(
                  "assigneeIds",
                  form.assigneeIds.length === members.length ? [] : members.map((member) => member.id),
                )
              }
              className="font-label-sm text-label-sm text-primary hover:underline"
            >
              {form.assigneeIds.length === members.length ? "Limpar seleção" : "Selecionar todos"}
            </button>
          </div>

          <div className="flex flex-wrap gap-space-xs">
            {members.map((member) => {
              const selected = form.assigneeIds.includes(member.id);

              return (
                <button
                  key={member.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleAssignee(member.id)}
                  className={[
                    "flex items-center gap-space-sm rounded-xl p-2 text-left transition-all",
                    selected
                      ? "bg-primary/15 ring-1 ring-primary/50"
                      : "bg-surface-container-highest/60 hover:bg-surface-container-highest",
                  ].join(" ")}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-on-secondary">
                    {selected ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : (
                      getInitials(member.name)
                    )}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate font-label-md text-label-md leading-tight text-on-surface">
                      {member.name}
                    </span>
                    <span className="truncate font-label-sm text-label-sm text-outline">
                      {member.jobTitle ?? "Colaborador"} • Nível {member.level}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface">
              Nível de Dificuldade & Recompensa
            </label>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim">
              Pontos por conclusão
            </span>
          </div>

          <div className="grid grid-cols-1 gap-space-xs sm:grid-cols-3">
            {DIFFICULTIES.map((item) => (
              <button
                key={item.value}
                type="button"
                aria-pressed={form.difficulty === item.value}
                onClick={() => setField("difficulty", item.value)}
                className={[
                  "rounded-xl p-space-sm text-left transition-all",
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
                <div className="mt-0.5 flex items-center gap-0.5 font-label-sm text-label-sm text-primary">
                  <span className="material-symbols-outlined text-xs">bolt</span>
                  {item.points} XP
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-xs">
          <label htmlFor="task-start" className="font-label-sm text-label-sm text-outline">
            Data de Início
          </label>
          <input
            id="task-start"
            type="date"
            min={today}
            max={form.dueDate || undefined}
            value={form.startDate}
            onChange={(event) => setField("startDate", event.target.value)}
            className={[inputClass, "h-10 px-space-sm font-body-sm text-body-sm"].join(" ")}
          />
        </div>

        <div className="flex flex-col gap-space-xs">
          <label htmlFor="task-due" className="font-label-sm text-label-sm text-outline">
            Prazo Final <span className="text-primary">*</span>
          </label>
          <input
            id="task-due"
            type="date"
            required
            min={form.startDate || today}
            value={form.dueDate}
            onChange={(event) => setField("dueDate", event.target.value)}
            className={[inputClass, "h-10 px-space-sm font-body-sm text-body-sm text-primary"].join(" ")}
          />
        </div>

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-1">
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

        {errors.length > 0 && (
          <ul
            role="alert"
            className="space-y-1 rounded-lg bg-error-container/30 px-space-md py-space-sm font-body-sm text-body-sm text-error md:col-span-2 lg:col-span-3"
          >
            {errors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-end gap-space-sm border-t border-surface-container-highest/50 pt-space-sm md:col-span-2 lg:col-span-3">
          <button
            type="button"
            onClick={resetForm}
            disabled={status === "loading"}
            className="w-full rounded-xl px-space-md py-2 font-label-md text-label-md text-outline transition-colors hover:text-on-surface disabled:opacity-60 sm:w-auto"
          >
            Limpar
          </button>

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-space-lg py-2.5 font-headline-sm text-headline-sm text-on-primary shadow-[0_0_20px_rgba(76,215,246,0.4)] transition-all hover:shadow-[0_0_28px_rgba(76,215,246,0.6)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                Publicando...
              </>
            ) : status === "success" ? (
              <>
                <span className="material-symbols-outlined text-lg">check</span>
                Tarefa Criada!
              </>
            ) : (
              <>
                Criar Tarefa
                <span className="material-symbols-outlined text-lg">bolt</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
