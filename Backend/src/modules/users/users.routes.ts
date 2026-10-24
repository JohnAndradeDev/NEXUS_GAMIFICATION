import bcrypt from "bcryptjs";
import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { AppError } from "../../lib/errors.js";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";
import { passwordSchema } from "../auth/auth.routes.js";
import { publicUserSelect } from "./user.select.js";

const roleEnum = z.enum(["USER", "GESTOR", "ADMIN"]);
const statusEnum = z.enum(["ACTIVE", "INACTIVE"]);

const idParams = z.object({ id: z.coerce.number().int().positive() });

const listQuery = paginationSchema.extend({
  status: statusEnum.optional(),
  role: roleEnum.optional(),
  sector: z.string().optional(),
  squadId: z.coerce.number().int().optional(),
  search: z.string().optional(),
  sort: z.enum(["xp-desc", "xp-asc", "name-asc"]).default("name-asc"),
});

const createBody = z.object({
  name: z.string().trim().min(2),
  email: z.email().toLowerCase(),
  password: passwordSchema,
  role: roleEnum.default("USER"),
  status: statusEnum.default("ACTIVE"),
  sector: z.string().trim().optional(),
  jobTitle: z.string().trim().min(1).optional(),
  squadId: z.number().int().nullable().optional(),
});

const adminUpdateBody = z
  .object({
    name: z.string().trim().min(2),
    email: z.email().toLowerCase(),
    role: roleEnum,
    sector: z.string().trim().nullable(),
    jobTitle: z.string().trim().nullable(),
    squadId: z.number().int().nullable(),
    avatarUrl: z.url().nullable(),
  })
  .partial();

const selfUpdateBody = z
  .object({
    name: z.string().trim().min(2),
    avatarUrl: z.url().nullable(),
  })
  .partial();

const statusBody = z.object({ status: statusEnum });

export const usersRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { page, perPage, search, sort, ...filters } = listQuery.parse(req.query);

    const where = {
      ...filters,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
          { jobTitle: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const orderBy =
      sort === "xp-desc"
        ? { experience: "desc" as const }
        : sort === "xp-asc"
          ? { experience: "asc" as const }
          : { name: "asc" as const };

    const [items, total] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        select: publicUserSelect,
        // id como desempate mantém a paginação estável
        orderBy: [orderBy, { id: "asc" as const }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ]);

    return { items, meta: paginationMeta(page, perPage, total) };
  });

  app.get("/:id", { preHandler: app.authenticate }, async (req) => {
    const { id } = idParams.parse(req.params);
    const me = req.user;

    const user = await prisma.user.findUnique({ where: { id }, select: publicUserSelect });
    if (!user) throw new AppError(404, "Usuário não encontrado");

    if (me.role !== "ADMIN" && me.sub !== id) {
      // gestor pode ver membros do próprio squad
      const manager =
        me.role === "GESTOR"
          ? await prisma.user.findUnique({ where: { id: me.sub }, select: { squadId: true } })
          : null;
      if (!manager?.squadId || manager.squadId !== user.squadId) {
        throw new AppError(403, "Sem permissão para ver este usuário");
      }
    }

    return { user };
  });

  app.post("/", { preHandler: app.authorize("ADMIN") }, async (req, reply) => {
    const { password, ...data } = createBody.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError(409, "E-mail já cadastrado");

    const user = await prisma.user.create({
      data: { ...data, passwordHash: await bcrypt.hash(password, 10) },
      select: publicUserSelect,
    });
    return reply.status(201).send({ user });
  });

  app.patch("/:id", { preHandler: app.authenticate }, async (req) => {
    const { id } = idParams.parse(req.params);
    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin && req.user.sub !== id) {
      throw new AppError(403, "Você só pode alterar os próprios dados");
    }

    // usuário comum só altera nome e avatar; cargo, setor e squad são do admin
    const data = isAdmin ? adminUpdateBody.parse(req.body) : selfUpdateBody.parse(req.body);

    if ("role" in data && data.role !== undefined && data.role !== "ADMIN" && id === req.user.sub) {
      throw new AppError(400, "Você não pode remover o seu próprio acesso de administrador");
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });

    // quem deixa de ser gestor, ou muda de squad, deixa de administrar o squad antigo
    const stillManager = user.role === "GESTOR" && user.squadId !== null;
    await prisma.squad.updateMany({
      where: {
        managerId: id,
        ...(stillManager ? { id: { not: user.squadId as number } } : {}),
      },
      data: { managerId: null },
    });

    return { user };
  });

  app.patch("/:id/status", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const { status } = statusBody.parse(req.body);

    if (id === req.user.sub && status === "INACTIVE") {
      throw new AppError(400, "Você não pode desativar a si mesmo");
    }

    const user = await prisma.user.update({
      where: { id },
      data: { status },
      select: publicUserSelect,
    });

    // usuário desativado não administra mais o squad
    if (status === "INACTIVE") {
      await prisma.squad.updateMany({ where: { managerId: id }, data: { managerId: null } });
    }

    return { user };
  });
};
