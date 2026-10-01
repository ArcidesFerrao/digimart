import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";

// POST /api/verify - verify a code
export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();

    if (!userId || !code) {
      return NextResponse.json(
        { error: "User ID e código são obrigatórios" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    if (user.verificationCode !== code) {
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
      where: { id: userId },
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
    return NextResponse.json(
      { error: "Erro ao verificar código" },
      { status: 500 }
    );
  }
}

// PUT /api/verify - resend code
export async function PUT(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID é obrigatório" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: userId },
      data: {
        verificationCode: newCode,
        verificationExpires: newExpires,
      },
    });

    console.log(`Novo código para ${user.email}: ${newCode}`);

    return NextResponse.json(
      {
        message: "Novo código enviado!",
        debugCode: newCode,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao reenviar código" },
      { status: 500 }
    );
  }
}
