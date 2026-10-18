export function SquadTasks() {
  return (
    <section className="flex flex-col rounded-xl bg-surface-container-low p-space-lg shadow-lg">
      <div className="mb-space-md flex items-center justify-between">
        <div className="flex items-center gap-space-xs">
          <div className="h-6 w-2.5 rounded-full bg-secondary" />
          <div className="flex items-center gap-2">
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Tarefas do Squad
            </h2>
            <span className="rounded-full bg-secondary-container px-2 py-0.5 font-label-sm text-label-sm font-semibold text-on-secondary-container">
              CyberTitans
            </span>
          </div>
        </div>

        <span className="material-symbols-outlined text-xl text-secondary">
          group_work
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-surface-container p-space-lg shadow-md">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />

        <div className="mb-space-sm flex flex-col gap-space-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full bg-primary-container px-2 py-0.5 font-label-sm text-label-sm font-bold text-on-primary-container">
                Missão Cooperativa
              </span>
              <span className="flex items-center gap-1 font-body-sm text-body-sm text-outline">
                <span className="material-symbols-outlined text-xs">timer</span>
                Restam 2 dias
              </span>
            </div>

            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Deploy de Infraestrutura Kubernetes Multi-Cloud v3.2
            </h3>
          </div>

          <div className="shrink-0 flex items-center gap-2 rounded-xl bg-surface-container-high px-space-md py-space-xs shadow-inner">
            <span className="material-symbols-outlined text-lg text-tertiary">
              workspace_premium
            </span>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline">
                Recompensa
              </span>
              <span className="font-label-lg text-label-lg font-extrabold leading-none text-tertiary">
                +50 pts Squad
              </span>
            </div>
          </div>
        </div>

        <div className="my-space-md flex flex-col">
          <div className="mb-2 flex items-center justify-between font-label-md text-label-md">
            <span className="font-medium text-on-surface-variant">
              Meta Coletiva do Sprint
            </span>
            <span className="font-bold text-tertiary">
              80% Concluído (8/10 entregas)
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-highest">
            <div
              className="h-full rounded-full bg-linear-to-r from-secondary to-tertiary shadow-[0_0_12px_rgba(78,222,163,0.5)] transition-all duration-700"
              style={{ width: "80%" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-space-xs">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3 overflow-hidden">
              <img
                alt="Lucas"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAq6l2BIeMXPJP-QoHaNqIUZJ9MGu8gUUn5q8stpBtzYP2sOhRCu-GUNBvNznX6cEqr1ULrEwt07F4sFiEeexOUNHnwScsOHWJ27rSKbjf0D0MJKEm6Qi8mdfWLEH_V83NmJgV7l663sBcGkWNAlUhlP2cUazFn3IckaSc_sWgmVuPGuo1Bj4x9oNHB9F5IW5NGmRjE_ocr52NBMfEJjQEX_yv7eGdAW3-RSQImRcLZrOoVB_t-Upyh"
              />
              <img
                alt="Camila"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBq6enDI1IPPBYfq9tFbEAO0Z98TrnViUm4mYzu9QjmDU5Jf5RXLUU9Z0j6ifN7pMTIPAd6eP0gZDAHi8upN3HNhBNHwCOQcFzBNqZCIlwLtGgF0nfyrU1byopZmXsXoiEsRQTi7GtDdYLrRdaf5fv1LIWDR2YUMQWcDUorpbUGeaLcVOg1E5q8O1P3HUcBecxEK8rJ5zokegD9Cc9wgYvsdDJBk5eTmq8BHzLD_jay9zTOIpAAcbpi"
              />
              <img
                alt="Rodrigo"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV7d1Wm9PMKnD1CTtJxqkiHS4Z0iwL7H3RLP7hXnr9FL111YJdAN6HWn2NOoB7U56pkFkguOf5UGjqwKPOIyWzDD2qE5_XBLljezvyp5KpLBt-EW6P4bAPCj3-kCSBBufKOIgQUZMyLx1smoKlKrMeoWto6eO5vNQNGabbMJhBsqG_nVKqqQLrLlg72Shb0a529jR3PZBHHcZ8SpDataa80_rOL_CHDVmC4iZPSqe0kfKIIT_tYwcc"
              />
              <img
                alt="João"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-surface-container"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuB8EQ7_KYx2UfvLAwIAchBl9v60YPf_X14xbBxVlhydEie0XIEcMFt9qaEkQYxd6BkAbeDpzN_Gw86sAQdlF3kvVE-9trBKLKXLiC_42JIrQGqfnK_67okB4TEW68-FwRNk0jNvvvNZ6TbXtUARSvkAghUmh1vJ8MsKC32tFuV5s04d0jMMhJcpZCo499JvdVotLXke_88Rv4z5patp3oCdyjekMKlP1KUTynsrO2t9LM1-FvtcGsJX"
              />
            </div>

            <span className="font-body-sm text-body-sm text-outline">
              Você + 3 engenheiros operando
            </span>
          </div>

          <button className="flex items-center gap-1 font-label-md text-label-md font-bold text-primary transition-colors hover:text-primary-fixed">
            <span>Painel do Squad</span>
            <span className="material-symbols-outlined text-base">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
