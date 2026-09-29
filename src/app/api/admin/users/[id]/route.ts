import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();
    const { isVerified, isAdmin: makeAdmin } = body;

    const updateData: any = {};
    if (isVerified !== undefined) updateData.isVerified = isVerified;
    if (makeAdmin !== undefined) updateData.isAdmin = makeAdmin;

    const user = await prisma.user.update({
      where: { id: (await params).id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        isVerified: true,
        isAdmin: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao actualizar utilizador" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id: (await params).id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao eliminar utilizador" }, { status: 500 });
  }
}
