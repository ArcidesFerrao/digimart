import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { generateUniqueCode, CODE_TTL_MS } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  bio: z.string().max(160).optional(),
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
    const verificationCode = await generateUniqueCode();
    const verificationExpires = new Date(Date.now() + CODE_TTL_MS);

    const user = await prisma.user.create({
      data: {
        ...validated,
        whatsapp: validated.whatsapp.trim(),
        password: hashedPassword,
        verificationCode,
        verificationExpires,
        isVerified: false,
      },
    });

    // Na Vercel a função termina quando a resposta sai, por isso o envio tem de ser aguardado.
    // Se falhar, a conta fica criada e o utilizador pode pedir novo código em /verify.
    const emailSent = await sendVerificationEmail({
      to: user.email,
      name: user.name,
      code: verificationCode,
    });

    return NextResponse.json(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        emailSent,
        message: emailSent
          ? "Conta criada. Enviámos um código de verificação para o teu email."
          : "Conta criada, mas não conseguimos enviar o email. Pede um novo código ao entrares.",
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
