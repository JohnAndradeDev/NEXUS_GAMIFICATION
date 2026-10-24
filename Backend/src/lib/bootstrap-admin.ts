import bcrypt from "bcryptjs";
import { passwordSchema } from "../modules/auth/auth.routes.js";
import { prisma } from "./prisma.js";

// Cria o administrador inicial a partir de variáveis de ambiente.
// É seguro rodar a cada inicialização: se o e-mail já existe, não faz nada
// (nunca altera a senha de um usuário existente).
export async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  // sem as variáveis, não cria ninguém
  if (!email || !password) return;

  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) {
    console.error(
      `ADMIN_PASSWORD inválida: ${parsed.error.issues.map((i) => i.message).join("; ")}`,
    );
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) return;

  await prisma.user.create({
    data: {
      name: process.env.ADMIN_NAME?.trim() || "Administrador",
      email,
      passwordHash: await bcrypt.hash(password, 10),
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`Administrador inicial criado: ${email}`);
}
