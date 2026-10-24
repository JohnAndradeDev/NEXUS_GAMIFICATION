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

  // squads e usuários de teste só em desenvolvimento
  if (isProd) return;

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

  await createUserIfMissing({
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
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
