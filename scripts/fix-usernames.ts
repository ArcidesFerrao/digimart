/**
 * Remove os espaços dos usernames existentes (ex: "Mika Merlin" -> "MikaMerlin").
 *
 * Uso (a partir da raiz do projecto):
 *   npx tsx scripts/fix-usernames.ts           -> simulação: lista as alterações, não grava nada
 *   npx tsx scripts/fix-usernames.ts --apply   -> grava as alterações na base de dados
 *
 * Se o novo username já existir (ou for criado por outra alteração do mesmo lote),
 * acrescenta 2, 3, ... (ex: "MikaMerlin2").
 *
 * Cada alteração fica registada em scripts/.username-changes.json (antigo -> novo),
 * para saberes a quem avisar e poderes reverter se for preciso.
 */
import { config } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

config({ path: ".env.local" });
config();

const APPLY = process.argv.includes("--apply");
const LOG_FILE = "scripts/.username-changes.json";

type U = { id: string; username: string };
type Change = { id: string; from: string; to: string; collided: boolean };

/** Remove todos os espaços (incluindo tabs e espaços unicode) do username. */
function stripSpaces(username: string): string {
  return username.replace(/\s+/g, "");
}

/**
 * Calcula as alterações sem tocar na base de dados.
 * Se o novo username já existir (na BD ou noutra alteração do mesmo lote),
 * acrescenta 2, 3, ... até ficar livre.
 */
function planRenames(users: U[]): Change[] {
  const taken = new Set(users.map((u) => u.username));
  const changes: Change[] = [];

  for (const u of users) {
    if (!/\s/.test(u.username)) continue;

    const base = stripSpaces(u.username);
    if (base.length === 0) continue; // username só com espaços: tratar manualmente

    taken.delete(u.username); // o antigo fica livre
    let candidate = base;
    let n = 2;
    while (taken.has(candidate)) {
      candidate = `${base}${n++}`;
    }
    taken.add(candidate);
    changes.push({ id: u.id, from: u.username, to: candidate, collided: candidate !== base });
  }
  return changes;
}

async function main() {
  // Importação dinâmica para o dotenv carregar o DATABASE_URL antes de src/lib/prisma.ts correr
  const { db } = await import("../src/lib/prisma");

  console.log("Base de dados:", new URL(process.env.DATABASE_URL!).host);

  const users = await db.user.findMany({
    select: { id: true, username: true },
    orderBy: { createdAt: "asc" },
  });

  const emptyAfterStrip = users.filter((u) => /\s/.test(u.username) && stripSpaces(u.username) === "");
  const changes = planRenames(users);

  console.log(`Total de utilizadores: ${users.length}`);
  console.log(`Com espaço no username: ${changes.length + emptyAfterStrip.length}`);
  console.log(`  com colisão (ganham número no fim): ${changes.filter((c) => c.collided).length}`);
  if (emptyAfterStrip.length) {
    console.log(`  só com espaços (ignorados, tratar à mão): ${emptyAfterStrip.map((u) => u.id).join(", ")}`);
  }

  console.log("\nAlterações:");
  for (const c of changes) {
    console.log(` - "${c.from}" -> "${c.to}"${c.collided ? "  (colisão)" : ""}`);
  }

  if (!APPLY) {
    console.log("\nSimulação: nada foi gravado. Corre com --apply para aplicar.");
    await db.$disconnect();
    return;
  }

  // Junta ao registo anterior, se existir, para não perder alterações de execuções passadas
  const previous: Change[] = existsSync(LOG_FILE) ? JSON.parse(readFileSync(LOG_FILE, "utf8")) : [];
  const done: Change[] = [];
  let failed = 0;

  for (const c of changes) {
    try {
      await db.user.update({ where: { id: c.id }, data: { username: c.to } });
      done.push(c);
      writeFileSync(LOG_FILE, JSON.stringify([...previous, ...done], null, 2));
    } catch (err) {
      failed++;
      console.error(`FALHOU "${c.from}" -> "${c.to}":`, (err as Error).message);
    }
  }

  console.log(`\nConcluído. Alterados: ${done.length} | Falhados: ${failed}`);
  console.log(`Registo guardado em ${LOG_FILE}`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
