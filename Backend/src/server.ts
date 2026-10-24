import { buildApp } from "./app.js";
import { env } from "./env.js";
import { ensureAdmin } from "./lib/bootstrap-admin.js";

const app = await buildApp();

try {
  await app.listen({
    port: env.PORT,
    host: env.NODE_ENV === "production" ? "0.0.0.0" : "127.0.0.1",
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

// depois de subir (o Render precisa ver a porta aberta rápido): cria o admin inicial
try {
  await ensureAdmin();
} catch (err) {
  app.log.error(err, "Falha ao criar o administrador inicial");
}
