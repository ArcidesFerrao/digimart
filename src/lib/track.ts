// lib/track.ts
import { db as prisma } from "@/lib/prisma";
import { FunnelStep } from "@prisma/client";

const BOT = /bot|crawler|spider|preview|whatsapp|facebookexternalhit|slurp/i;

export const isBot = (ua: string | null) => !ua || BOT.test(ua);

export async function track(data: {
  type: FunnelStep;
  productId: string;
  sessionId?: string;
  ref?: string;
  userId?: string;
}) {
  try {
    await prisma.productEvent.create({ data });
  } catch (e) {
    console.error("[track]", e); // tracking nunca deve partir a página
  }
}