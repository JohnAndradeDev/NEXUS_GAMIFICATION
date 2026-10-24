import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import type { Role } from "../generated/prisma/enums.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

const isProd = process.env.NODE_ENV === "production";

const DEV_SQUADS = ["CyberTitans", "DevCommanders", "CloudWarriors", "PixelForge", "DataKnights"];

async function createUserIfMissing(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
  sector?: string;
  jobTitle?: string;
  squadId?: number;
}) {
  const { password, ...rest } = data;

  // update vazio: rodar o seed de novo não sobrescreve senha nem dados existentes
  const user = await prisma.user.upsert({
    where: { email: rest.email },
    update: {},
    create: { ...rest, passwordHash: await bcrypt.hash(password, 10) },
  });

  console.log(`✔ ${rest.role.padEnd(6)} ${rest.email}`);
  return user;
}

const POINTS = { FACIL: 5, MEDIO: 10, DIFICIL: 15 } as const;

async function seedDemoTasks(ctx: { squadId: number; managerId: number; memberId: number }) {
  const HOUR = 60 * 60 * 1000;
  const demo = [
    { title: "Implementar autenticação OAuth2 SSO", category: "Backend", difficulty: "DIFICIL", inHours: 6 },
    { title: "Revisar PRs do módulo de telemetria", category: "Code Review", difficulty: "MEDIO", inHours: 30 },
    { title: "Escrever documentação técnica da API NEXUS", category: "Docs", difficulty: "FACIL", inHours: 24 * 5 },
  ] as const;

  for (const item of demo) {
    const exists = await prisma.task.findFirst({
      where: { title: item.title, squadId: ctx.squadId },
      select: { id: true },
    });
    if (exists) continue;

    await prisma.task.create({
      data: {
        title: item.title,
        category: item.category,
        difficulty: item.difficulty,
        basePoints: POINTS[item.difficulty],
        dueDate: new Date(Date.now() + item.inHours * HOUR),
        squadId: ctx.squadId,
        createdById: ctx.managerId,
        assignments: { create: { userId: ctx.memberId } },
      },
    });
    console.log(`✔ TAREFA ${item.title}`);
  }
}

const ACHIEVEMENT_CATALOG = [
  { code: "first-mission", name: "Primeira Missão", description: "Conclua a sua primeira missão", icon: "flag", type: "TASK_COUNT", target: 1, pointsBonus: 5 },
  { code: "ten-missions", name: "Maratonista", description: "Conclua 10 missões", icon: "directions_run", type: "TASK_COUNT", target: 10, pointsBonus: 25 },
  { code: "fifty-missions", name: "Veterano", description: "Conclua 50 missões", icon: "military_tech", type: "TASK_COUNT", target: 50, pointsBonus: 100 },
  { code: "points-100", name: "Centena", description: "Alcance 100 pontos", icon: "toll", type: "POINTS_TOTAL", target: 100, pointsBonus: 10 },
  { code: "points-1000", name: "Mil Pontos", description: "Alcance 1.000 pontos", icon: "stars", type: "POINTS_TOTAL", target: 1000, pointsBonus: 50 },
  { code: "streak-3", name: "Embalo", description: "Pontue por 3 dias seguidos", icon: "local_fire_department", type: "STREAK", target: 3, pointsBonus: 10 },
  { code: "streak-7", name: "Semana Perfeita", description: "Pontue por 7 dias seguidos", icon: "whatshot", type: "STREAK", target: 7, pointsBonus: 30 },
  { code: "top-3", name: "Pódio", description: "Chegue ao top 3 do ranking da empresa", icon: "workspace_premium", type: "RANKING", target: 3, pointsBonus: 20 },
  { code: "teamwork-3", name: "Trabalho em Equipe", description: "Conclua 3 missões cooperativas", icon: "diversity_3", type: "TEAMWORK", target: 3, pointsBonus: 15 },
] as const;

async function seedAchievementCatalog() {
  for (const item of ACHIEVEMENT_CATALOG) {
    // update vazio: rodar o seed de novo não sobrescreve ajustes feitos pelo admin
    await prisma.achievement.upsert({ where: { code: item.code }, update: {}, create: item });
    console.log(`✔ CONQUISTA ${item.name}`);
  }
}

async function main() {
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? (isProd ? undefined : "Admin1234");
  if (!adminPassword) {
    throw new Error("Defina SEED_ADMIN_PASSWORD para rodar o seed em produção");
  }

  await createUserIfMissing({
    name: "Administrador",
    email: process.env.SEED_ADMIN_EMAIL ?? "admin@nexus.com",
    password: adminPassword,
    role: "ADMIN",
    sector: "Infraestrutura",
    jobTitle: "Tech Lead",
  });

  // catálogo de conquistas, squads e usuários de teste só em desenvolvimento
  if (isProd) return;

  await seedAchievementCatalog();

  const squadIds = new Map<string, number>();
  for (const name of DEV_SQUADS) {
    const squad = await prisma.squad.upsert({ where: { name }, update: {}, create: { name } });
    squadIds.set(name, squad.id);
    console.log(`✔ SQUAD  ${name}`);
  }

  const cyberTitansId = squadIds.get("CyberTitans");

  const manager = await createUserIfMissing({
    name: "Gestor Teste",
    email: "gestor@nexus.com",
    password: "Gestor1234",
    role: "GESTOR",
    sector: "Engenharia",
    jobTitle: "Product Manager",
    squadId: cyberTitansId,
  });

  const member = await createUserIfMissing({
    name: "Usuário Teste",
    email: "usuario@nexus.com",
    password: "Usuario1234",
    role: "USER",
    sector: "Engenharia",
    jobTitle: "Desenvolvedor",
    squadId: cyberTitansId,
  });

  if (cyberTitansId) {
    await prisma.squad.updateMany({
      where: { id: cyberTitansId, managerId: null },
      data: { managerId: manager.id },
    });

    await seedDemoTasks({ squadId: cyberTitansId, managerId: manager.id, memberId: member.id });
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
