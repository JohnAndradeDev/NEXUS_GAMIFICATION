import type { FastifyInstance } from "fastify";
import { env } from "../env.js";
import { AppError } from "../lib/errors.js";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Mesma origem que o CORS usa (FRONTEND_URL). Aceita várias separadas por vírgula.
const allowedOrigins = new Set(
  env.FRONTEND_URL.split(",").map((origin) => origin.trim().replace(/\/$/, "")),
);

// Defesa contra CSRF: com cookie SameSite=None, um site de terceiros consegue
// disparar requisições com o cookie do usuário. Navegadores sempre enviam o
// cabeçalho Origin em POST/PUT/PATCH/DELETE, então bloqueamos origens desconhecidas.
// Sem Origin (curl, Postman, servidor→servidor) deixamos passar: não é cenário de CSRF.
export function registerOriginCheck(app: FastifyInstance) {
  app.addHook("onRequest", async (req) => {
    if (!UNSAFE_METHODS.has(req.method)) return;

    const origin = req.headers.origin;
    if (!origin) return;

    if (!allowedOrigins.has(origin.replace(/\/$/, ""))) {
      throw new AppError(403, "Origem não permitida");
    }
  });
}
