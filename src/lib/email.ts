const RESEND_URL = "https://api.resend.com/emails";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Envia o código de verificação por email (Resend).
 * Nunca lança erro: devolve true se o Resend aceitou o pedido, false caso contrário.
 * Variáveis de ambiente: RESEND_API_KEY, EMAIL_FROM, EMAIL_REPLY_TO (opcional).
 */
export async function sendVerificationEmail(params: {
  to: string;
  name: string;
  code: string;
}): Promise<boolean> {
  const { to, name, code } = params;

  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    console.error("Email não configurado: faltam RESEND_API_KEY ou EMAIL_FROM");
    return false;
  }

  const firstName = name.trim().split(/\s+/)[0] || "";
  const greeting = firstName ? `Olá, ${firstName}!` : "Olá!";

  const text = `${greeting}

O teu código de verificação do DigiMart é: ${code}

O código é válido durante 24 horas. Introduz-o na página de verificação para activares a tua conta.

Se não foste tu que criaste esta conta, ignora este email.

DigiMart · Evolure Labs`;

  const html = `<!doctype html>
<html lang="pt">
<body style="margin:0;padding:24px;background:#0b0f19;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
  <div style="max-width:480px;margin:0 auto;background:#111827;border-radius:12px;padding:32px;line-height:1.6;font-size:15px;">
    <p style="margin-top:0;font-size:18px;"><strong>${escapeHtml(greeting)}</strong></p>
    <p>Usa este código para verificares a tua conta no DigiMart:</p>
    <p style="text-align:center;margin:28px 0;">
      <span style="display:inline-block;background:#0b0f19;border:1px solid #1e2d45;border-radius:8px;padding:14px 24px;font-size:32px;letter-spacing:8px;font-family:'Courier New',monospace;color:#1fb57a;font-weight:bold;">${escapeHtml(code)}</span>
    </p>
    <p>O código é válido durante 24 horas.</p>
    <p style="color:#9ca3af;font-size:13px;margin-bottom:0;">Se não foste tu que criaste esta conta, ignora este email.</p>
  </div>
</body>
</html>`;

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [to],
        subject: `O teu código de verificação DigiMart: ${code}`,
        html,
        text,
        ...(process.env.EMAIL_REPLY_TO ? { reply_to: process.env.EMAIL_REPLY_TO } : {}),
      }),
    });

    if (!res.ok) {
      console.error("Resend falhou:", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Erro ao contactar o Resend:", err);
    return false;
  }
}
