import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env.js";
import { AppError } from "./lib/errors.js";
import { achievementsRoutes } from "./modules/achievements/achievements.routes.js";
import { adminRoutes } from "./modules/admin/admin.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { notificationsRoutes } from "./modules/notifications/notifications.routes.js";
import { pointsRoutes } from "./modules/points/points.routes.js";
import { rankingsRoutes } from "./modules/rankings/rankings.routes.js";
import { squadsRoutes } from "./modules/squads/squads.routes.js";
import { tasksRoutes } from "./modules/tasks/tasks.routes.js";
import { usersRoutes } from "./modules/users/users.routes.js";
import { authPlugin } from "./plugins/auth.js";
import { registerOriginCheck } from "./plugins/origin-check.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      redact: [
        "req.headers.authorization",
        "req.headers.cookie",
        "res.headers['set-cookie']",
      ],
    },
    // Atrás do proxy do Render, req.ip precisa ser o IP do cliente (usado no limite
    // de tentativas). NÃO use `true`: com `true` o cliente consegue forjar
    // X-Forwarded-For e escapar do limite.
    // `hop` é a posição na cadeia de proxies (0 = quem conectou direto à API).
    // Confia só no primeiro proxy (o do Render); suba para `hop < 2` se precisar.
    trustProxy:
      env.NODE_ENV === "production"
        ? (_address: string, hop: number) => hop < 1
        : false,
  });

  // --- Tudo que é global fica ANTES das rotas ---------------------------------
  // Hooks, CORS, rate limit e o error handler só valem para as rotas registradas
  // depois deles (encapsulamento do Fastify).
  await app.register(helmet);
  await app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });
  await app.register(authPlugin);
  await app.register(rateLimit, {
    global: false, // só nas rotas que declaram config.rateLimit
    hook: "preHandler", // roda depois do corpo ser lido (o login usa o e-mail na chave)
    errorResponseBuilder: () =>
      new AppError(
        429,
        "Muitas tentativas. Tente novamente em alguns minutos.",
      ),
  });
  registerOriginCheck(app);

  app.setErrorHandler((error, req, reply) => {
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Dados inválidos",
        errors: error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      });
    }
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ message: error.message });
    }
    const code = (error as { code?: string }).code;
    if (code === "P2002")
      return reply.status(409).send({ message: "Registro duplicado" });
    if (code === "P2025")
      return reply.status(404).send({ message: "Registro não encontrado" });
    if (code === "P2003")
      return reply
        .status(400)
        .send({ message: "Referência inválida (ex.: squad inexistente)" });

    req.log.error(error);
    return reply.status(500).send({ message: "Erro interno do servidor" });
  });

  app.get("/health", async () => ({ status: "ok" }));

  // --- Rotas ------------------------------------------------------------------
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(usersRoutes, { prefix: "/api/users" });
  await app.register(squadsRoutes, { prefix: "/api/squads" });
  await app.register(adminRoutes, { prefix: "/api/admin" });
  await app.register(tasksRoutes, { prefix: "/api/tasks" });
  await app.register(pointsRoutes, { prefix: "/api/points" });
  await app.register(rankingsRoutes, { prefix: "/api/rankings" });
  await app.register(achievementsRoutes, { prefix: "/api/achievements" });
  await app.register(notificationsRoutes, { prefix: "/api/notifications" });

  return app;
}
