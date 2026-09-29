import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.id !== (await params).id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { name, whatsapp, bio, avatar } = body;

    const user = await prisma.user.update({
      where: { id: (await params).id },
      data: {
        ...(name && { name }),
        ...(whatsapp && { whatsapp }),
        ...(bio !== undefined && { bio }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        whatsapp: true,
        bio: true,
        avatar: true,
        isVerified: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao actualizar perfil" }, { status: 500 });
  }
}
