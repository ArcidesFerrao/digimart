// scripts/normalize-phones.ts
import { db as prisma } from "@/lib/prisma";
import { normalizeMzPhone } from "@/lib/phone";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, whatsapp: true },
  });

  const invalid: typeof users = [];
  const failed: { id: string; error: string }[] = [];
  let updated = 0;

  for (const u of users) {
    const normalized = normalizeMzPhone(u.whatsapp);

    if (!normalized) {
      invalid.push(u);
      continue;
    }
    if (normalized === u.whatsapp) continue;

    try {
      await prisma.user.update({
        where: { id: u.id },
        data: { whatsapp: normalized },
      });
      updated++;
    } catch (e) {
      failed.push({ id: u.id, error: String(e) }); // ex.: duplicado (unique)
    }
  }

  console.log(`Actualizados: ${updated}`);
  console.log("Inválidos (rever à mão):", invalid);
  console.log("Falharam:", failed);
}

main().finally(() => prisma.$disconnect());