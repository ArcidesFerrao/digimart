import { NextRequest, NextResponse } from "next/server";
import { db as  prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3),
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

    const user = await prisma.user.create({
      data: {
        ...validated,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, name: user.name },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}
