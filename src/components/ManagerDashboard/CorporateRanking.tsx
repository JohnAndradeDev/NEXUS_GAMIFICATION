export function CorporateRanking() {
  return (
    <section className="flex flex-col justify-between rounded-xl bg-surface-container-low/90 p-4 shadow-md backdrop-blur-md sm:p-space-lg">
      <div>
        <div className="mb-space-md flex items-center justify-between border-b border-surface-container-highest/60 pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-xl text-primary">
              workspace_premium
            </span>

            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                Ranking Corporativo de Squads
              </h3>
              <p className="font-body-sm text-body-sm text-outline">
                Ciclo vigente Q2 • Atualizado em tempo real
              </p>
            </div>
          </div>

          <span className="flex shrink-0 items-center gap-1 rounded-full bg-tertiary/10 px-space-sm py-1 font-label-sm text-label-sm text-tertiary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-tertiary" />
            Ao Vivo
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[500px] w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-surface-container-highest/60 font-label-sm text-label-sm uppercase tracking-wider text-outline">
                <th className="px-space-xs py-space-sm">Pos</th>
                <th className="px-space-sm py-space-sm">Squad</th>
                <th className="px-space-xs py-space-sm text-center">Membros</th>
                <th className="px-space-xs py-space-sm text-center">
                  Entregas
                </th>
                <th className="px-space-sm py-space-sm text-right">
                  Pontuação
                </th>
                <th className="px-space-xs py-space-sm text-center">
                  Variação
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-surface-container-highest/40 font-body-md text-body-md">
              <tr className="transition-colors hover:bg-surface-container/50">
                <td className="px-space-xs py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F59E0B]/20 font-headline-sm text-headline-sm text-[#F59E0B]">
                    1º
                  </span>
                </td>
                <td className="px-space-sm py-3">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      DevCommanders
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Core Backend & Architecture
                    </span>
                  </div>
                </td>
                <td className="px-space-xs py-3 text-center text-on-surface-variant">
                  10
                </td>
                <td className="px-space-xs py-3 text-center">71/75</td>
                <td className="px-space-sm py-3 text-right">
                  <span className="font-headline-sm text-headline-sm">
                    14.890
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-outline">
                    pts
                  </span>
                </td>
                <td className="px-space-xs py-3 text-center text-outline">—</td>
              </tr>

              <tr className="bg-primary/10 shadow-[inset_3px_0_0_0_rgba(76,215,246,1)]">
                <td className="px-space-xs py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary font-headline-sm text-headline-sm text-on-primary">
                    2º
                  </span>
                </td>
                <td className="px-space-sm py-3">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-headline-sm text-headline-sm text-primary">
                        CyberTitans
                      </span>
                      <span className="rounded bg-primary/20 px-1.5 py-0.5 font-label-sm text-label-sm text-primary-fixed-dim">
                        Seu Squad
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Engenharia & Infraestrutura
                    </span>
                  </div>
                </td>
                <td className="px-space-xs py-3 text-center text-primary">8</td>
                <td className="px-space-xs py-3 text-center text-primary">
                  64/72
                </td>
                <td className="px-space-sm py-3 text-right text-primary">
                  <span className="font-headline-sm text-headline-sm">
                    13.420
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-primary-fixed-dim">
                    pts
                  </span>
                </td>
                <td className="px-space-xs py-3 text-center">
                  <span className="flex items-center justify-center gap-0.5 font-label-sm text-label-sm font-bold text-tertiary">
                    <span className="material-symbols-outlined text-xs">
                      arrow_upward
                    </span>
                    +1
                  </span>
                </td>
              </tr>

              <tr className="transition-colors hover:bg-surface-container/50">
                <td className="px-space-xs py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B45309]/20 font-headline-sm text-headline-sm text-[#B45309]">
                    3º
                  </span>
                </td>
                <td className="px-space-sm py-3">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      CloudWarriors
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Site Reliability Engineering
                    </span>
                  </div>
                </td>
                <td className="px-space-xs py-3 text-center text-on-surface-variant">
                  9
                </td>
                <td className="px-space-xs py-3 text-center">59/68</td>
                <td className="px-space-sm py-3 text-right">
                  <span className="font-headline-sm text-headline-sm">
                    12.850
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-outline">
                    pts
                  </span>
                </td>
                <td className="px-space-xs py-3 text-center text-error">
                  ↓ -1
                </td>
              </tr>

              <tr className="transition-colors hover:bg-surface-container/50">
                <td className="px-space-xs py-3 text-outline">4º</td>
                <td className="px-space-sm py-3">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      UXGuardians
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Design System & Frontend
                    </span>
                  </div>
                </td>
                <td className="px-space-xs py-3 text-center text-on-surface-variant">
                  7
                </td>
                <td className="px-space-xs py-3 text-center">52/60</td>
                <td className="px-space-sm py-3 text-right">
                  <span className="font-headline-sm text-headline-sm">
                    11.600
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-outline">
                    pts
                  </span>
                </td>
                <td className="px-space-xs py-3 text-center text-outline">—</td>
              </tr>

              <tr className="transition-colors hover:bg-surface-container/50">
                <td className="px-space-xs py-3 text-outline">5º</td>
                <td className="px-space-sm py-3">
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">
                      DataAlchemists
                    </span>
                    <span className="font-body-sm text-body-sm text-outline">
                      Analytics & Big Data
                    </span>
                  </div>
                </td>
                <td className="px-space-xs py-3 text-center text-on-surface-variant">
                  8
                </td>
                <td className="px-space-xs py-3 text-center">48/58</td>
                <td className="px-space-sm py-3 text-right">
                  <span className="font-headline-sm text-headline-sm">
                    10.940
                  </span>{" "}
                  <span className="font-body-sm text-body-sm text-outline">
                    pts
                  </span>
                </td>
                <td className="px-space-xs py-3 text-center text-tertiary">
                  ↑ +1
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-space-sm flex flex-wrap items-center justify-between gap-2 pt-space-md font-body-sm text-body-sm text-outline">
        <span>
          Sprint encerra em:{" "}
          <strong className="text-on-surface">4 dias e 18h</strong>
        </span>

        <button className="flex items-center gap-0.5 font-label-md text-label-md text-primary hover:underline">
          Ver Ranking Completo
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </div>
    </section>
  );
}
