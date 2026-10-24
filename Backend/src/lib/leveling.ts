// Regra de níveis (ajuste aqui se quiser outra curva).
// XP acumulado necessário para ALCANÇAR cada nível:
//   nível 1 = 0, nível 2 = 100, nível 3 = 300, nível 4 = 600, nível 5 = 1000...
export function xpForLevel(level: number) {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number) {
  let level = 1;
  while (xpForLevel(level + 1) <= xp) level += 1;
  return level;
}

export function levelProgress(xp: number) {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);

  return {
    level,
    currentXp: xp - base,
    neededXp: next - base,
    percent: Math.round(((xp - base) / (next - base)) * 100),
    xpToNext: next - xp,
  };
}
