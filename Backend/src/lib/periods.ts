// Períodos do ranking:
//   week  = últimos 7 dias
//   month = mês corrente, desde o dia 1º (fuso de Brasília, UTC-3 sem horário de verão)
//   all   = todo o histórico
export type Period = "week" | "month" | "all";

export interface TimeWindow {
  from?: Date;
  to?: Date; // exclusivo
}

const DAY_MS = 24 * 60 * 60 * 1000;
const BRAZIL_OFFSET_MS = 3 * 60 * 60 * 1000;

// A janela atual e a anterior servem para calcular a variação de posição.
// Em "all", a anterior é "tudo o que existia antes dos últimos 7 dias".
export function periodWindows(period: Period, now = new Date()) {
  const weekAgo = new Date(now.getTime() - 7 * DAY_MS);

  if (period === "week") {
    return {
      current: { from: weekAgo } as TimeWindow,
      previous: { from: new Date(now.getTime() - 14 * DAY_MS), to: weekAgo } as TimeWindow,
    };
  }

  if (period === "all") {
    return { current: {} as TimeWindow, previous: { to: weekAgo } as TimeWindow };
  }

  const brasilia = new Date(now.getTime() - BRAZIL_OFFSET_MS);
  const year = brasilia.getUTCFullYear();
  const month = brasilia.getUTCMonth();
  // meia-noite em Brasília = 03:00 UTC
  const monthStart = new Date(Date.UTC(year, month, 1, 3));
  const previousMonthStart = new Date(Date.UTC(year, month - 1, 1, 3));

  return {
    current: { from: monthStart } as TimeWindow,
    previous: { from: previousMonthStart, to: monthStart } as TimeWindow,
  };
}

export function createdAtFilter(window: TimeWindow) {
  if (!window.from && !window.to) return {};

  return {
    createdAt: {
      ...(window.from && { gte: window.from }),
      ...(window.to && { lt: window.to }),
    },
  };
}
