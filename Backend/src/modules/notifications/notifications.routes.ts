import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";

export const notificationsRoutes: FastifyPluginAsync = async (app) => {
  // Notificações de quem está logado, da mais recente para a mais antiga
  app.get("/", { preHandler: app.authenticate }, async (req) => {
    const { page, perPage, unread } = paginationSchema
      .extend({ unread: z.enum(["true"]).optional() })
      .parse(req.query);

    const userId = req.user.sub;
    const where = { userId, ...(unread && { readAt: null }) };

    const [items, total, unreadCount] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          link: true,
          readAt: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, readAt: null } }),
    ]);

    return { items, meta: paginationMeta(page, perPage, total), unreadCount };
  });

  // Leve o bastante para o navegador consultar de tempos em tempos (badge do sino)
  app.get("/unread-count", { preHandler: app.authenticate }, async (req) => {
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.sub, readAt: null },
    });
    return { unreadCount };
  });

  // Marca todas como lidas
  app.patch("/read-all", { preHandler: app.authenticate }, async (req, reply) => {
    await prisma.notification.updateMany({
      where: { userId: req.user.sub, readAt: null },
      data: { readAt: new Date() },
    });
    return reply.status(204).send();
  });

  // Marca uma como lida. O filtro por usuário impede mexer na notificação de outra pessoa,
  // e repetir a chamada é inofensivo.
  app.patch("/:id/read", { preHandler: app.authenticate }, async (req, reply) => {
    const { id } = z.object({ id: z.coerce.number().int().positive() }).parse(req.params);

    await prisma.notification.updateMany({
      where: { id, userId: req.user.sub, readAt: null },
      data: { readAt: new Date() },
    });
    return reply.status(204).send();
  });
};
