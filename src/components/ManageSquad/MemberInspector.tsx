interface MemberInspectorProps {
  selectedMember: string;
}

export function MemberInspector({ selectedMember }: MemberInspectorProps) {
  const memberData = {
    "João Silveira": {
      role: "Engenheiro de Software Pleno • Backend",
      points: "2.450 XP Coletados",
      rank: "#2",
      level: "Nível 14",
      punctuality: "96%",
      finishedTasks: "38",
      share: "18.2%",
    },
    "Mariana Rios": {
      role: "Tech Lead & Gestora • Sênior",
      points: "2.840 XP Coletados",
      rank: "#1",
      level: "Nível 18",
      punctuality: "98%",
      finishedTasks: "42",
      share: "22.8%",
    },
    "Lucas Mendes": {
      role: "DevOps & SRE • Sênior",
      points: "2.120 XP Coletados",
      rank: "#3",
      level: "Nível 12",
      punctuality: "91%",
      finishedTasks: "31",
      share: "15.6%",
    },
    "Beatriz Lima": {
      role: "Engenheira Frontend • Plena",
      points: "1.890 XP Coletados",
      rank: "#4",
      level: "Nível 11",
      punctuality: "93%",
      finishedTasks: "27",
      share: "13.9%",
    },
    "Rafael Souza": {
      role: "QA Automation Specialist",
      points: "1.620 XP Coletados",
      rank: "#5",
      level: "Nível 9",
      punctuality: "95%",
      finishedTasks: "22",
      share: "11.8%",
    },
    "Carla Nogueira": {
      role: "Product Owner • Assist",
      points: "1.450 XP Coletados",
      rank: "#6",
      level: "Nível 8",
      punctuality: "89%",
      finishedTasks: "19",
      share: "10.5%",
    },
  } as const;

  const data =
    memberData[selectedMember as keyof typeof memberData] ??
    memberData["João Silveira"];

  return (
    <aside className="flex w-full flex-col gap-6 xl:col-span-4">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-low p-4 shadow-xl sm:p-6">
        <div className="pointer-events-none absolute right-0 top-0 h-36 w-36 rounded-full bg-primary/10 blur-2xl" />

        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              contact_page
            </span>

            <span className="font-headline-sm text-headline-sm text-on-surface">
              Ficha do Integrante
            </span>
          </div>

          <span className="rounded-full bg-tertiary/10 px-2 py-0.5 font-label-sm text-label-sm text-tertiary">
            Telemetria Real
          </span>
        </div>

        <div className="my-4 flex items-center gap-3.5 rounded-xl bg-surface-container-lowest/60 px-3.5 py-4 sm:my-5 sm:gap-4 sm:px-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-on-primary shadow-md">
            {selectedMember
              .split(" ")
              .map((part) => part[0])
              .join("")}

            <span className="absolute -right-1 -top-1 rounded-md bg-secondary-container px-1.5 py-0.5 font-label-sm text-label-sm font-bold text-on-secondary-container">
              {data.rank}
            </span>
          </div>

          <div className="flex min-w-0 flex-col">
            <h3 className="truncate font-headline-md text-headline-md text-on-surface">
              {selectedMember}
            </h3>

            <p className="truncate font-body-sm text-body-sm text-outline">
              {data.role}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="font-label-sm text-label-sm font-bold text-primary">
                {data.points}
              </span>
              <span className="text-outline">•</span>
              <span className="font-label-sm text-label-sm text-tertiary">
                {data.level}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3 sm:mb-6">
          <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3.5">
            <div className="mb-1 flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase">
                Pontualidade
              </span>
              <span className="material-symbols-outlined text-base text-tertiary">
                timer
              </span>
            </div>

            <p className="font-headline-md text-headline-md text-on-surface">
              {data.punctuality}
            </p>

            <p className="font-body-sm text-body-sm font-medium text-tertiary">
              SLA de Sprint
            </p>
          </div>

          <div className="flex flex-col justify-between rounded-xl bg-surface-container p-3.5">
            <div className="mb-1 flex items-center justify-between text-outline">
              <span className="font-label-sm text-label-sm uppercase">
                Finalizado
              </span>
              <span className="material-symbols-outlined text-base text-primary">
                task_alt
              </span>
            </div>

            <p className="font-headline-md text-headline-md text-on-surface">
              {data.finishedTasks}
            </p>

            <p className="font-body-sm text-body-sm text-outline">
              Tarefas fechadas
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-3 rounded-xl bg-surface-container p-3.5 sm:mb-6 sm:p-4">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface">
              Impacto na Pontuação Coletiva
            </span>

            <span className="font-label-md text-label-md font-bold text-primary">
              {data.share}
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-primary-container shadow-[0_0_8px_rgba(6,182,212,0.4)] transition-all duration-500"
              style={{ width: data.share }}
            />
          </div>

          <div className="flex items-center justify-between font-body-sm text-body-sm text-outline">
            <span>Quota individual</span>
            <span>Total Squad: 13.410 pts</span>
          </div>
        </div>

        <div className="mb-5 space-y-2.5 sm:mb-6 sm:space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface">
              Fila de Tarefas Operacionais
            </span>

            <span className="font-label-sm text-label-sm text-outline">
              1 Em Curso • 2 na Fila
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-lowest/80 p-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
                <span className="truncate font-body-md text-body-md text-on-surface">
                  Migração Redis Cluster v7
                </span>
              </div>

              <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 font-label-sm text-label-sm text-primary">
                Em Andamento
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-lowest/80 p-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-outline" />
                <span className="truncate font-body-md text-body-md text-on-surface-variant">
                  Refatorar Handshake JWT Auth
                </span>
              </div>

              <span className="shrink-0 rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-outline">
                Na Fila
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-lg bg-surface-container-lowest/80 p-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-outline" />
                <span className="truncate font-body-md text-body-md text-on-surface-variant">
                  Testes de Carga com K6
                </span>
              </div>

              <span className="shrink-0 rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-label-sm text-outline">
                Na Fila
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label-md text-label-md text-on-surface">
              Arsenal de Conquistas
            </span>

            <span className="font-label-sm text-label-sm font-bold text-secondary">
              12 Badges
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container p-2.5">
              <span className="material-symbols-outlined text-2xl text-primary">
                verified
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                Clean
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container p-2.5">
              <span className="material-symbols-outlined text-2xl text-tertiary">
                cloud_sync
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                0 Downtime
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container p-2.5">
              <span className="material-symbols-outlined text-2xl text-secondary">
                military_tech
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                Sprint Ace
              </span>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 rounded-xl bg-surface-container p-2.5">
              <span className="material-symbols-outlined text-2xl text-amber-400">
                psychology
              </span>
              <span className="font-label-sm text-label-sm text-outline">
                Mentor
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
