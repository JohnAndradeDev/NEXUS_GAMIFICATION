import type { Prisma } from "../../../generated/prisma/client.js";
import type { NotificationType } from "../../../generated/prisma/enums.js";
import { prisma } from "../../lib/prisma.js";

type Client = Prisma.TransactionClient;

export interface NotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

// Cria a notificação para uma ou várias pessoas.
// Dentro de uma transação, use esta: se algo falhar, tudo é desfeito junto.
export async function notify(client: Client, userIds: number | number[], input: NotificationInput) {
  const ids = [...new Set(Array.isArray(userIds) ? userIds : [userIds])];
  if (ids.length === 0) return;

  await client.notification.createMany({
    data: ids.map((userId) => ({
      userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link ?? null,
    })),
  });
}

// Fora de transação, a ação principal já aconteceu e não pode ser desfeita:
// se avisar falhar, registra o erro e segue em frente.
export async function notifySafe(userIds: number | number[], input: NotificationInput) {
  try {
    await notify(prisma, userIds, input);
  } catch (error) {
    console.error("Falha ao criar notificação:", error instanceof Error ? error.message : error);
  }
}
