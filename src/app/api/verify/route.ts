import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  generateUniqueCode,
  CODE_TTL_MS,
  RESEND_COOLDOWN_MS,
} from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

// POST /api/verify - verificar o código (só o próprio utilizador autenticado)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { code } = await req.json();

    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "O código deve ter 6 dígitos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilizador não encontrado" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { message: "Conta já está verificada" },
        { status: 200 }
      );
    }

    if (!user.verificationCode || user.verificationCode !== code) {
      return NextResponse.json(
        { error: "Código incorrecto" },
        { status: 400 }
      );
    }

    if (user.verificationExpires && user.verificationExpires < new Date()) {
      return NextResponse.json(
        { error: "Código expirado. Solicita um novo." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationCode: null,
        verificationExpires: null,
      },
    });

    return NextResponse.json(
      { message: "Conta verificada com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao verificar código" },
      { status: 500 }
    );
  }
}

// PUT /api/verify - reenviar o código por email
export async function PUT() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilizador não encontrado" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { error: "Conta já está verificada" },
        { status: 400 }
      );
    }

    // Intervalo mínimo entre envios. O momento do último envio deduz-se da validade
    // (validade = envio + 24h), por isso não precisa de campo novo na base de dados.
    if (user.verificationExpires) {
      const lastSent = user.verificationExpires.getTime() - CODE_TTL_MS;
      const waitMs = RESEND_COOLDOWN_MS - (Date.now() - lastSent);
      if (waitMs > 0) {
        return NextResponse.json(
          {
            error: `Aguarda ${Math.ceil(waitMs / 1000)} segundos antes de pedir outro código.`,
          },
          { status: 429 }
        );
      }
    }

    const newCode = await generateUniqueCode();
    const newExpires = new Date(Date.now() + CODE_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: newCode, verificationExpires: newExpires },
    });

    const sent = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      code: newCode,
    });

    if (!sent) {
      return NextResponse.json(
        { error: "Não foi possível enviar o email. Tenta novamente daqui a pouco." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message: "Novo código enviado!" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao reenviar código" },
      { status: 500 }
    );
  }
}
