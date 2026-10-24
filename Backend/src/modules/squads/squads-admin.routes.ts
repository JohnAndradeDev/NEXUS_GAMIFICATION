import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import type { Prisma } from "../../../generated/prisma/client.js";
import { AppError } from "../../lib/errors.js";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";

const idParams = z.object({ id: z.coerce.number().int().positive() });

const createBody = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(500).optional(),
  managerId: z.number().int().positive().nullable().optional(),
});

const updateBody = z
  .object({
    name: z.string().trim().min(2).max(60),
    description: z.string().trim().max(500).nullable(),
    managerId: z.number().int().positive().nullable(),
  })
  .partial();

const statusBody = z.object({ isActive: z.boolean() });

// Valida o futuro gestor e o vincula ao squad (quem lidera o squad também é membro dele)
async function assignManager(tx: Prisma.TransactionClient, squadId: number, managerId: number) {
  const user = await tx.user.findUnique({
    where: { id: managerId },
    select: { status: true, role: true, squadId: true },
  });

  if (!user) throw new AppError(404, "Gestor não encontrado");
  if (user.status !== "ACTIVE") throw new AppError(409, "Este usuário está desativado");
  if (user.role !== "GESTOR") {
    throw new AppError(400, "Só é possível definir como gestor um usuário com perfil de gestor");
  }
  if (user.squadId !== null && user.squadId !== squadId) {
    throw new AppError(409, "Este gestor já pertence a outro squad");
  }

  const other = await tx.squad.findFirst({
    where: { managerId, id: { not: squadId } },
    select: { name: true },
  });
  if (other) throw new AppError(409, `Este gestor já administra o squad ${other.name}`);

  await tx.user.update({ where: { id: managerId }, data: { squadId } });
}

export const squadsAdminRoutes: FastifyPluginAsync = async (app) => {
  // ---- todos os squads, inclusive os desativados ----
  app.get("/all", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { page, perPage, search, isActive } = paginationSchema
      .extend({
        search: z.string().trim().optional(),
        isActive: z.enum(["true", "false"]).optional(),
      })
      .parse(req.query);

    const where: Prisma.SquadWhereInput = {
      ...(isActive && { isActive: isActive === "true" }),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    };

    const [squads, total] = await prisma.$transaction([
      prisma.squad.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          createdAt: true,
          manager: { select: { id: true, name: true } },
          _count: { select: { members: { where: { status: "ACTIVE" } } } },
        },
        orderBy: [{ name: "asc" }, { id: "asc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.squad.count({ where }),
    ]);

    const items = squads.map(({ _count, ...squad }) => ({
      ...squad,
      memberCount: _count.members,
    }));

    return { items, meta: paginationMeta(page, perPage, total) };
  });

  // ---- criar ----
  app.post("/", { preHandler: app.authorize("ADMIN") }, async (req, reply) => {
    const { name, description, managerId } = createBody.parse(req.body);

    if (await prisma.squad.findUnique({ where: { name }, select: { id: true } })) {
      throw new AppError(409, "Já existe um squad com esse nome");
    }

    const squad = await prisma.$transaction(async (tx) => {
      const created = await tx.squad.create({
        data: { name, description },
        select: { id: true, name: true },
      });

      if (managerId) {
        await assignManager(tx, created.id, managerId);
        await tx.squad.update({ where: { id: created.id }, data: { managerId } });
      }

      return created;
    });

    return reply.status(201).send({ squad });
  });

  // ---- editar (nome, descrição e gestor) ----
  app.patch("/:id", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const body = updateBody.parse(req.body);

    const current = await prisma.squad.findUnique({
      where: { id },
      select: { name: true },
    });
    if (!current) throw new AppError(404, "Squad não encontrado");

    if (body.name !== undefined && body.name !== current.name) {
      if (await prisma.squad.findUnique({ where: { name: body.name }, select: { id: true } })) {
        throw new AppError(409, "Já existe um squad com esse nome");
      }
    }

    await prisma.$transaction(async (tx) => {
      if (body.managerId) await assignManager(tx, id, body.managerId);

      await tx.squad.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name }),
          ...(body.description !== undefined && { description: body.description }),
          // managerId null tira o gestor; ele continua como membro do squad
          ...(body.managerId !== undefined && { managerId: body.managerId }),
        },
      });
    });

    return { squad: { id } };
  });

  // ---- desativar e reativar ----
  app.patch("/:id/status", { preHandler: app.authorize("ADMIN") }, async (req) => {
    const { id } = idParams.parse(req.params);
    const { isActive } = statusBody.parse(req.body);

    const exists = await prisma.squad.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new AppError(404, "Squad não encontrado");

    const squad = await prisma.squad.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    });

    return { squad };
  });
};
