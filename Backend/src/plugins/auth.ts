import cookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import fp from "fastify-plugin";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Role } from "../../generated/prisma/enums.js";
import { env } from "../env.js";
import { AppError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";

export const COOKIE_NAME = "nexus_token";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { sub: number; role: Role };
    user: { sub: number; role: Role };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (
      ...roles: Role[]
    ) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export const authPlugin = fp(async (app) => {
  await app.register(cookie);
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: COOKIE_NAME, signed: false },
    sign: { expiresIn: env.JWT_EXPIRES_IN_SECONDS },
  });

  app.decorate("authenticate", async (req: FastifyRequest) => {
    try {
      await req.jwtVerify();
    } catch {
      throw new AppError(401, "Não autenticado");
    }

    // garante que um usuário desativado perca o acesso imediatamente
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: { status: true, role: true },
    });
    if (!user || user.status !== "ACTIVE") {
      throw new AppError(401, "Usuário inativo ou inexistente");
    }
    req.user.role = user.role;
  });

  app.decorate("authorize", (...roles: Role[]) => {
    return async (req: FastifyRequest, reply: FastifyReply) => {
      await app.authenticate(req, reply);
      if (!roles.includes(req.user.role)) {
        throw new AppError(403, "Sem permissão para acessar este recurso");
      }
    };
  });
});
