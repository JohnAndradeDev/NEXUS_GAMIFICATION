import { useState } from "react";

export function SquadTaskForm() {
  const [category, setCategory] = useState("DevOps");
  const [difficulty, setDifficulty] = useState("Difícil");
  const [priority, setPriority] = useState("Alta");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("loading");

    setTimeout(() => {
      setStatus("success");

      setTimeout(() => {
        setStatus("idle");
      }, 2000);
    }, 800);
  }

  return (
    <section
      id="squad-task-form"
      className="relative mb-space-xl overflow-hidden rounded-xl bg-surface-container-low/90 p-4 shadow-xl backdrop-blur-xl sm:p-space-lg"
    >
      <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary-container to-transparent" />

      <div className="mb-space-lg flex flex-col justify-between gap-2 border-b border-surface-container-highest/50 pb-space-md sm:flex-row sm:items-center">
        <div className="flex items-center gap-space-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container/20 text-primary shadow-inner">
            <span className="material-symbols-outlined text-2xl">
              rocket_launch
            </span>
          </div>

          <div>
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Criar Nova Tarefa para o Squad
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Defina escopo, colaborador e recompensa por complexidade técnica.
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
          <label className="flex items-center justify-between font-label-md text-label-md text-on-surface">
            <span>
              Título da Tarefa <span className="text-primary">*</span>
            </span>
            <span className="hidden font-body-sm text-body-sm text-outline sm:inline">
              Objetivo claro e acionável
            </span>
          </label>

          <input
            defaultValue="Migração do banco de dados para cluster distribuído"
            placeholder="Ex: Refatorar pipeline de deploy seguro em staging"
            className="h-11 w-full rounded-xl bg-surface-container-highest/60 px-space-md font-body-md text-body-md text-on-surface outline-none transition-all hover:bg-surface-container-highest focus:bg-surface-container-highest focus:shadow-[0_0_0_2px_rgba(76,215,246,0.3)]"
          />
        </div>

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-2">
          <label className="flex items-center justify-between font-label-md text-label-md text-on-surface">
            <span>Descrição Detalhada & Critérios</span>
            <span className="hidden font-body-sm text-body-sm text-outline sm:inline">
              Suporta Markdown
            </span>
          </label>

          <textarea
            defaultValue={`1. Executar benchmarking de latência entre as réplicas atuais e o novo cluster distribuído.
2. Garantir consistência transacional sem perdas de escrita durante a migração.
3. Critério de aceite: Latência P99 inferior a 45ms sob carga máxima simulada.`}
            rows={4}
            className="w-full resize-none rounded-xl bg-surface-container-highest/60 p-space-md font-body-md text-body-md text-on-surface outline-none transition-all hover:bg-surface-container-highest focus:bg-surface-container-highest focus:shadow-[0_0_0_2px_rgba(76,215,246,0.3)]"
          />
        </div>

        <div className="flex flex-col gap-space-xs">
          <label className="font-label-md text-label-md text-on-surface">
            Membro Responsável / Colaborador
          </label>

          <button
            type="button"
            className="flex items-center justify-between rounded-xl bg-surface-container-highest/60 p-2.5 text-left transition-all hover:bg-surface-container-highest"
          >
            <div className="flex min-w-0 items-center gap-space-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-on-secondary">
                LM
              </div>

              <div className="flex min-w-0 flex-col">
                <span className="truncate font-label-md text-label-md leading-tight text-on-surface">
                  Lucas Mendes
                </span>
                <span className="truncate font-label-sm text-label-sm text-outline">
                  DevOps Lead • Nível 12
                </span>
              </div>
            </div>

            <span className="material-symbols-outlined shrink-0 text-base text-primary">
              expand_more
            </span>
          </button>

          <label className="mt-3 font-label-md text-label-md text-on-surface">
            Categoria de Missão
          </label>

          <div className="flex flex-wrap gap-1.5">
            {["DevOps", "Backend", "Frontend", "QA"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={[
                  "flex items-center gap-1 rounded-lg px-2.5 py-1 font-label-md text-label-md transition-all",
                  category === item
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant hover:text-on-surface",
                ].join(" ")}
              >
                <span className="material-symbols-outlined text-sm">
                  {item === "DevOps"
                    ? "dns"
                    : item === "Backend"
                      ? "terminal"
                      : item === "Frontend"
                        ? "web"
                        : "bug_report"}
                </span>
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-3">
          <div className="flex items-center justify-between">
            <label className="font-label-md text-label-md text-on-surface">
              Nível de Dificuldade & Recompensa
            </label>
            <span className="font-label-sm text-label-sm text-tertiary-fixed-dim">
              Bônus de Sprint Ativo
            </span>
          </div>

          <div className="grid grid-cols-1 gap-space-xs sm:grid-cols-3">
            {[
              ["Fácil", "+5 pts", "25 XP"],
              ["Médio", "+10 pts", "50 XP"],
              ["Difícil", "+15 pts", "100 XP"],
            ].map(([label, points, xp]) => (
              <button
                key={label}
                type="button"
                onClick={() => setDifficulty(label)}
                className={[
                  "rounded-xl p-space-sm text-left transition-all",
                  difficulty === label
                    ? "bg-secondary-container shadow-[0_0_18px_rgba(87,27,193,0.45)]"
                    : "bg-surface-container-highest/50 hover:bg-surface-container-highest",
                ].join(" ")}
              >
                <div className="font-label-sm text-label-sm uppercase tracking-wider text-outline">
                  {label}
                </div>
                <div className="mt-1 font-headline-sm text-headline-sm text-on-surface">
                  {points}
                </div>
                <div className="mt-0.5 flex items-center gap-0.5 font-label-sm text-label-sm text-primary">
                  <span className="material-symbols-outlined text-xs">
                    bolt
                  </span>
                  {xp}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-xs">
          <label className="font-label-sm text-label-sm text-outline">
            Data de Início
          </label>
          <input
            type="date"
            defaultValue="2026-10-05"
            className="h-10 rounded-lg bg-surface-container-highest/60 px-space-sm font-body-sm text-body-sm text-on-surface outline-none"
          />
        </div>

        <div className="flex flex-col gap-space-xs">
          <label className="font-label-sm text-label-sm text-outline">
            Prazo Final
          </label>
          <input
            type="date"
            defaultValue="2026-10-12"
            className="h-10 rounded-lg bg-surface-container-highest/60 px-space-sm font-body-sm text-body-sm text-primary outline-none"
          />
        </div>

        <div className="flex flex-col gap-space-xs md:col-span-2 lg:col-span-1">
          <label className="font-label-sm text-label-sm text-outline">
            Prioridade da Demanda
          </label>

          <div className="grid grid-cols-3 gap-space-xs text-center font-label-md text-label-md">
            {["Baixa", "Média", "Alta"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPriority(item)}
                className={[
                  "rounded-lg py-1.5 transition-all",
                  priority === item
                    ? "bg-error-container font-headline-sm text-headline-sm text-on-error-container"
                    : "bg-surface-container-highest text-outline hover:text-on-surface",
                ].join(" ")}
              >
                {item === "Alta" && (
                  <span className="material-symbols-outlined mr-1 align-middle text-sm">
                    local_fire_department
                  </span>
                )}
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-space-sm border-t border-surface-container-highest/50 pt-space-sm md:col-span-2 lg:col-span-3">
          <button
            type="button"
            className="w-full rounded-xl px-space-md py-2 font-label-md text-label-md text-outline transition-colors hover:text-on-surface sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            className="w-full rounded-xl bg-surface-container-high px-space-md py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-bright sm:w-auto"
          >
            Salvar Rascunho
          </button>

          <button
            type="submit"
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-space-lg py-2.5 font-headline-sm text-headline-sm text-on-primary shadow-[0_0_20px_rgba(76,215,246,0.4)] transition-all hover:shadow-[0_0_28px_rgba(76,215,246,0.6)] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {status === "loading" ? (
              <>
                <span className="material-symbols-outlined animate-spin text-lg">
                  refresh
                </span>
                Publicando...
              </>
            ) : status === "success" ? (
              <>
                <span className="material-symbols-outlined text-lg text-tertiary">
                  check
                </span>
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
