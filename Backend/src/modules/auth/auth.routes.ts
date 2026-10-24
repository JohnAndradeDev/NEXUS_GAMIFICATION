import bcrypt from "bcryptjs";
import type { FastifyPluginAsync, FastifyRequest } from "fastify";
import { z } from "zod";
import { env } from "../../env.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import { COOKIE_NAME } from "../../plugins/auth.js";
import { publicUserSelect } from "../users/user.select.js";

export const passwordSchema = z
  .string()
  .min(8, "A senha deve ter ao menos 8 caracteres")
  .regex(/[A-Za-z]/, "A senha deve conter letras")
  .regex(/\d/, "A senha deve conter números")
  .refine(
    (value) => Buffer.byteLength(value, "utf8") <= 72,
    "A senha deve ter no máximo 72 caracteres",
  );

// A foto é guardada como data URL pequeno (o front reduz para 160x160 JPEG, ~6-15 KB).
const MAX_AVATAR_CHARS = 60_000; // ~45 KB de imagem em base64

function isRealImage(dataUrl: string) {
  const buffer = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  if (buffer.length === 0) return false;

  const isJpeg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  const isPng = buffer
    .subarray(0, 8)
    .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  const isWebp =
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";

  return isJpeg || isPng || isWebp;
}

const avatarSchema = z.object({
  avatarUrl: z
    .string()
    .max(MAX_AVATAR_CHARS, "A imagem é grande demais")
    .regex(
      /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/,
      "Formato de imagem inválido",
    )
    .refine(isRealImage, "Arquivo de imagem inválido"),
});

// Conta de demonstração (portfólio): visitantes não podem trocar a senha nem a foto.
function assertNotDemoAccount(email: string, message: string) {
  const demoEmail = process.env.DEMO_USER_EMAIL?.trim().toLowerCase();
  if (demoEmail && email.toLowerCase() === demoEmail) {
    throw new AppError(403, message);
  }
}

const avatarRateLimit = {
  max: 10,
  timeWindow: "15 minutes",
  keyGenerator: (req: FastifyRequest) => String(req.user?.sub ?? req.ip),
};

const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
  remember: z.boolean().default(true),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Informe a senha atual"),
  newPassword: passwordSchema,
});

// Usado quando o e-mail não existe: o bcrypt roda mesmo assim e o tempo de resposta
// não revela quais e-mails estão cadastrados.
const DUMMY_HASH = bcrypt.hashSync("senha-inexistente", 10);

const isProd = env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProd,
  // front e API em domínios diferentes (ex.: Render) exigem sameSite "none" + secure
  sameSite: (isProd ? "none" : "lax") as "none" | "lax",
  path: "/",
};

export const authRoutes: FastifyPluginAsync = async (app) => {
  // 10 tentativas / 15 min por IP + e-mail. Exige o rateLimit registrado com
  // hook: "preHandler" (o corpo precisa já ter sido lido para ler o e-mail).
  app.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: "15 minutes",
          keyGenerator: (req) => {
            const email = (req.body as { email?: unknown } | undefined)?.email;
            return `${req.ip}:${String(email ?? "").toLowerCase().slice(0, 254)}`;
          },
        },
      },
    },
    async (req, reply) => {
      const { email, password, remember } = loginSchema.parse(req.body);

      const user = await prisma.user.findUnique({ where: { email } });
      const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
      if (!user || !valid) throw new AppError(401, "E-mail ou senha inválidos");
      if (user.status !== "ACTIVE") throw new AppError(403, "Usuário desativado");

      const token = app.jwt.sign({ sub: user.id, role: user.role });

      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
        select: publicUserSelect,
      });

      return reply
        .setCookie(COOKIE_NAME, token, {
          ...cookieOptions,
          // sem "lembrar", o cookie vira de sessão e some ao fechar o navegador
          ...(remember && { maxAge: env.JWT_EXPIRES_IN_SECONDS }),
        })
        .send({ user: updated });
    },
  );

  app.post("/logout", async (_req, reply) => {
    return reply.clearCookie(COOKIE_NAME, cookieOptions).status(204).send();
  });

  app.get("/me", { preHandler: app.authenticate }, async (req) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.user.sub },
      select: publicUserSelect,
    });
    return { user };
  });

  // troca a própria senha (usuário vem do cookie, nunca do corpo)
  app.patch(
    "/change-password",
    {
      preHandler: app.authenticate,
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes",
          // por usuário logado (cai para o IP se o authenticate ainda não rodou)
          keyGenerator: (req) => String(req.user?.sub ?? req.ip),
        },
      },
    },
    async (req, reply) => {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

      const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user.sub } });

      assertNotDemoAccount(
        user.email,
        "A senha da conta de demonstração não pode ser alterada.",
      );

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) throw new AppError(400, "Senha atual incorreta");

      const same = await bcrypt.compare(newPassword, user.passwordHash);
      if (same) throw new AppError(400, "A nova senha deve ser diferente da atual");

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash: await bcrypt.hash(newPassword, 10) },
      });

      return reply.status(204).send();
    },
  );

  // troca a própria foto (usuário vem do cookie, nunca do corpo)
  app.patch(
    "/me/avatar",
    { preHandler: app.authenticate, config: { rateLimit: avatarRateLimit } },
    async (req) => {
      const { avatarUrl } = avatarSchema.parse(req.body);

      const current = await prisma.user.findUniqueOrThrow({
        where: { id: req.user.sub },
        select: { email: true },
      });
      assertNotDemoAccount(
        current.email,
        "A foto da conta de demonstração não pode ser alterada.",
      );

      const user = await prisma.user.update({
        where: { id: req.user.sub },
        data: { avatarUrl },
        select: publicUserSelect,
      });
      return { user };
    },
  );

  app.delete(
    "/me/avatar",
    { preHandler: app.authenticate, config: { rateLimit: avatarRateLimit } },
    async (req) => {
      const current = await prisma.user.findUniqueOrThrow({
        where: { id: req.user.sub },
        select: { email: true },
      });
      assertNotDemoAccount(
        current.email,
        "A foto da conta de demonstração não pode ser alterada.",
      );

      const user = await prisma.user.update({
        where: { id: req.user.sub },
        data: { avatarUrl: null },
        select: publicUserSelect,
      });
      return { user };
    },
  );
};
