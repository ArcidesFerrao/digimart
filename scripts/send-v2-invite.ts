/**
 * Envia o convite da versão 2 do DigiMart aos utilizadores criados antes de 20 de Setembro.
 *
 * Uso (a partir da raiz do projecto):
 *   npx tsx scripts/send-v2-invite.ts                      -> simulação (não envia nada, lista destinatários)
 *   npx tsx scripts/send-v2-invite.ts --test o@teu.email   -> envia UM email de teste para esse endereço
 *   npx tsx scripts/send-v2-invite.ts --send               -> envia para todos os destinatários filtrados
 *
 * Variáveis de ambiente (.env ou .env.local):
 *   DATABASE_URL, RESEND_API_KEY, EMAIL_FROM (ex: "DigiMart <no-reply@evolurelabs.com>"),
 *   EMAIL_REPLY_TO (opcional, ex: o teu Gmail)
 *
 * Os endereços já enviados ficam registados em scripts/.sent-v2-invite.json,
 * por isso podes voltar a correr o script sem enviar duplicados.
 */
import { config } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

config({ path: ".env.local" });
config();

// 20 de Setembro de 2026, 00:00 em Maputo (UTC+2)
const CUTOFF = new Date("2026-09-20T00:00:00+02:00");
const SITE_URL = "https://digimart.evolurelabs.com";
const SUBJECT = "O DigiMart está melhor — experimente a nova versão";
const SENT_FILE = "scripts/.sent-v2-invite.json";
const DELAY_MS = 600; // o Resend limita a ~2 pedidos por segundo por defeito

const args = process.argv.slice(2);
const SEND = args.includes("--send");
const testIdx = args.indexOf("--test");
const TEST_TO = testIdx !== -1 ? args[testIdx + 1] : undefined;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function buildEmail(fullName: string) {
  const firstName = fullName.trim().split(/\s+/)[0] || "";
  const greeting = firstName ? `Olá, ${firstName}!` : "Olá!";

  const text = `${greeting}

Criaste a tua conta no DigiMart nas primeiras semanas da plataforma, e queremos agradecer por teres estado connosco desde o início.

Sabemos que, nessa altura, a experiência ainda tinha arestas: alguns passos eram confusos e nem tudo funcionava como devia. Ouvimos quem testou e passámos as últimas semanas a corrigir isso. A versão 2 já está online, com todos os fluxos revistos e a funcionar: registo, entrada na conta, publicação de produtos e contacto com vendedores.

A tua conta continua activa. Basta entrares com o teu email e a tua palavra-passe:
${SITE_URL}

O que podes fazer agora:
- Explorar os produtos digitais publicados por criadores moçambicanos
- Publicar os teus próprios produtos e chegar a novos clientes
- Contactar o vendedor directamente pelo WhatsApp

O DigiMart ainda está em fase de testes e ainda não tem pagamentos online: a compra é combinada directamente com o vendedor (M-Pesa ou e-Mola). Por isso, a tua opinião vale muito. Se algo não funcionar bem ou tiveres uma sugestão, responde a este email e lemos todas as mensagens.

Obrigado por fazeres parte desta construção.

Evolure Labs
www.evolurelabs.com`;

  const html = `<!doctype html>
<html lang="pt">
<body style="margin:0;padding:24px;background:#0b0f19;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
  <div style="max-width:560px;margin:0 auto;background:#111827;border-radius:12px;padding:32px;line-height:1.6;font-size:15px;">
    <p style="margin-top:0;font-size:18px;"><strong>${escapeHtml(greeting)}</strong></p>
    <p>Criaste a tua conta no DigiMart nas primeiras semanas da plataforma, e queremos agradecer por teres estado connosco desde o início.</p>
    <p>Sabemos que, nessa altura, a experiência ainda tinha arestas: alguns passos eram confusos e nem tudo funcionava como devia. Ouvimos quem testou e passámos as últimas semanas a corrigir isso. A <strong>versão 2</strong> já está online, com todos os fluxos revistos e a funcionar: registo, entrada na conta, publicação de produtos e contacto com vendedores.</p>
    <p>A tua conta continua activa. Basta entrares com o teu email e a tua palavra-passe:</p>
    <p style="text-align:center;margin:28px 0;">
      <a href="${SITE_URL}" style="background:#1fb57a;color:#06130d;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:8px;display:inline-block;">Experimentar o DigiMart</a>
    </p>
    <p style="margin-bottom:4px;">O que podes fazer agora:</p>
    <ul style="margin-top:0;padding-left:20px;">
      <li>Explorar os produtos digitais publicados por criadores moçambicanos</li>
      <li>Publicar os teus próprios produtos e chegar a novos clientes</li>
      <li>Contactar o vendedor directamente pelo WhatsApp</li>
    </ul>
    <p>O DigiMart ainda está em fase de testes e ainda não tem pagamentos online: a compra é combinada directamente com o vendedor (M-Pesa ou e-Mola). Por isso, a tua opinião vale muito. Se algo não funcionar bem ou tiveres uma sugestão, responde a este email e lemos todas as mensagens.</p>
    <p>Obrigado por fazeres parte desta construção.</p>
    <p style="margin-bottom:0;">Evolure Labs<br><a href="https://www.evolurelabs.com" style="color:#1fb57a;">www.evolurelabs.com</a></p>
  </div>
</body>
</html>`;

  return { text, html };
}

async function sendEmail(to: string, name: string): Promise<void> {
  const { text, html } = buildEmail(name);

  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject: SUBJECT,
        html,
        text,
        ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      }),
    });

    if (res.ok) return;

    if (res.status === 429 && attempt < 3) {
      await sleep(1500 * attempt); // limite de pedidos: espera e tenta de novo
      continue;
    }
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

function loadSent(): Set<string> {
  if (!existsSync(SENT_FILE)) return new Set();
  return new Set(JSON.parse(readFileSync(SENT_FILE, "utf8")) as string[]);
}

function saveSent(sent: Set<string>) {
  writeFileSync(SENT_FILE, JSON.stringify([...sent], null, 2));
}

async function main() {
  if (SEND || TEST_TO) {
    for (const key of ["RESEND_API_KEY", "EMAIL_FROM"]) {
      if (!process.env[key]) throw new Error(`Falta a variável de ambiente ${key}`);
    }
  }

  // Modo de teste: um único email, sem tocar na base de dados
  if (TEST_TO) {
    await sendEmail(TEST_TO, "Arcides");
    console.log(`Email de teste enviado para ${TEST_TO}`);
    return;
  }

  // Importação dinâmica para o dotenv carregar o DATABASE_URL antes de src/lib/prisma.ts correr
  const { db } = await import("../src/lib/prisma");

  const users = await db.user.findMany({
    where: { createdAt: { lt: CUTOFF } },
    select: { name: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const sent = loadSent();
  const pending = users.filter((u) => !sent.has(u.email.toLowerCase()));

  console.log(`Criados antes de ${CUTOFF.toISOString()}: ${users.length}`);
  console.log(`Já enviados anteriormente: ${users.length - pending.length}`);
  console.log(`Por enviar: ${pending.length}`);

  if (!SEND) {
    console.log("\nSimulação (nada foi enviado). Primeiros 10 destinatários:");
    pending.slice(0, 10).forEach((u) => console.log(` - ${u.name} <${u.email}> (${u.createdAt.toISOString().slice(0, 10)})`));
    console.log("\nCorre com --send para enviar, ou --test o@teu.email para um teste.");
    await db.$disconnect();
    return;
  }

  let ok = 0;
  let failed = 0;

  for (const [i, u] of pending.entries()) {
    try {
      await sendEmail(u.email, u.name);
      sent.add(u.email.toLowerCase());
      saveSent(sent); // grava a cada envio para poder retomar se algo falhar
      ok++;
      console.log(`[${i + 1}/${pending.length}] enviado -> ${u.email}`);
    } catch (err) {
      failed++;
      console.error(`[${i + 1}/${pending.length}] FALHOU -> ${u.email}:`, (err as Error).message);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nConcluído. Enviados: ${ok} | Falhados: ${failed}`);
  await db.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
