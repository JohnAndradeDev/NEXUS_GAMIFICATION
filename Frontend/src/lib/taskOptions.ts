import type { TaskDifficulty } from "./tasks";

export const CATEGORIES = [
  { name: "DevOps", icon: "dns" },
  { name: "Backend", icon: "terminal" },
  { name: "Frontend", icon: "web" },
  { name: "QA", icon: "bug_report" },
];

// espelha a regra do backend: 5 / 10 / 15 pontos, e 1 ponto = 1 XP
export const DIFFICULTIES: { value: TaskDifficulty; label: string; points: number }[] = [
  { value: "FACIL", label: "Fácil", points: 5 },
  { value: "MEDIO", label: "Médio", points: 10 },
  { value: "DIFICIL", label: "Difícil", points: 15 },
];

export const PRIORITIES = [
  { value: 1, label: "Baixa" },
  { value: 2, label: "Média" },
  { value: 3, label: "Alta" },
];

export const DIFFICULTY_LABEL: Record<TaskDifficulty, string> = {
  FACIL: "Fácil",
  MEDIO: "Médio",
  DIFICIL: "Difícil",
};

export const PRIORITY_LABEL: Record<number, string> = {
  1: "Baixa",
  2: "Média",
  3: "Alta",
};
