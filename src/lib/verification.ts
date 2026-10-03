import { randomInt } from "node:crypto";
import { db as prisma } from "@/lib/prisma";

export const CODE_TTL_MS = 24 * 60 * 60 * 1000; // o código vale 24h
export const RESEND_COOLDOWN_MS = 60 * 1000; // espera mínima entre dois envios

/**
 * Gera um código de 6 dígitos criptograficamente seguro.
 * O campo verificationCode é @unique, por isso confirma que não está em uso
 * (evita um erro 500 raro quando dois utilizadores recebem o mesmo código).
 */
export async function generateUniqueCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const code = randomInt(100000, 1000000).toString();
    const exists = await prisma.user.findFirst({
      where: { verificationCode: code },
      select: { id: true },
    });
    if (!exists) return code;
  }
  throw new Error("Não foi possível gerar um código único");
}
