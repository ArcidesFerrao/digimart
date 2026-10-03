import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  username: z
    .string()
    .trim()
    .min(3, "O username deve ter pelo menos 3 caracteres")
    .max(30, "O username não pode ter mais de 30 caracteres")
    .regex(
      /^[A-Za-z0-9_]+$/,
      "O username só pode ter letras, números e _ (sem espaços)"
    ),
  whatsapp: z.string().min(9),
});

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = registerSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validated.email },
          { username: validated.username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email ou username já existe" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await prisma.user.create({
      data: {
        ...validated,
        whatsapp: validated.whatsapp.trim(),
        password: hashedPassword,
        verificationCode,
        verificationExpires,
        isVerified: true, //temporariamente
      },
    });

    // Aqui enviarias o código via SMS/WhatsApp API
    // Por agora, retornamos no response para facilitar testes
    console.log(`Código de verificação para ${user.email}: ${verificationCode}`);

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        message: "Conta criada. Verifica o teu email/WhatsApp para o código de activação.",
        // Em produção, remover isto:
        debugCode: verificationCode,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message ?? "Dados inválidos" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
