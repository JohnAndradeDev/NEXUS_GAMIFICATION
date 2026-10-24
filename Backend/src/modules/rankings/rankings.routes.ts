import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { paginationMeta, paginationSchema } from "../../lib/pagination.js";
import { prisma } from "../../lib/prisma.js";
import { getSquadStandings } from "../squads/squads.service.js";
import { getUserStandings } from "./rankings.service.js";

const periodSchema = z.enum(["week", "month", "all"]).default("all");

export const rankingsRoutes: FastifyPluginAsync = async (app) => {
  // Ranking de squads. Qualquer usuário autenticado pode ver.
  // `me` = posição do squad de quem está logado (null se não tiver squad).
  app.get("/squads", { preHandler: app.authenticate }, async (req) => {
    const { page, perPage, period } = paginationSchema
      .extend({ period: periodSchema })
      .parse(req.query);

    const [standings, mine] = await Promise.all([
      getSquadStandings(period),
      prisma.user.findUnique({ where: { id: req.user.sub }, select: { squadId: true } }),
    ]);

    const myStanding = mine?.squadId
      ? standings.find((standing) => standing.id === mine.squadId)
      : undefined;

    return {
      items: standings.slice((page - 1) * perPage, page * perPage),
      meta: paginationMeta(page, perPage, standings.length),
      me: myStanding
        ? {
            position: myStanding.position,
            points: myStanding.points,
            delta: myStanding.delta,
            total: standings.length,
          }
        : null,
    };
  });

  // Ranking de colaboradores (geral ou de um squad). `me` = posição de quem está logado,
  // dentro do mesmo filtro (null para admin, que não tem pontuação).
  app.get("/users", { preHandler: app.authenticate }, async (req) => {
    const { page, perPage, period, squadId } = paginationSchema
      .extend({
        period: periodSchema,
        squadId: z.coerce.number().int().positive().optional(),
      })
      .parse(req.query);

    const standings = await getUserStandings(period, squadId);
    const mine = standings.find((standing) => standing.id === req.user.sub);

    return {
      items: standings.slice((page - 1) * perPage, page * perPage),
      meta: paginationMeta(page, perPage, standings.length),
      me: mine
        ? {
            position: mine.position,
            points: mine.points,
            delta: mine.delta,
            total: standings.length,
          }
        : null,
    };
  });
};
