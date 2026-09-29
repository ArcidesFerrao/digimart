import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> }
) {
  const product = await prisma.product.findUnique({
    where: { id: (await params).id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          username: true,
          whatsapp: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const body = await req.json();

    // Check ownership
    const existing = await prisma.product.findUnique({
      where: { id: (await params).id },
      select: { sellerId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    // Only seller or admin can update
    if (existing.sellerId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const product = await prisma.product.update({
      where: { id: (await params).id },
      data: body,
    });

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }:  { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const existing = await prisma.product.findUnique({
      where: { id: (await params).id },
      select: { sellerId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    if (existing.sellerId !== session.user.id && !session.user.isAdmin) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await prisma.product.delete({
      where: { id: (await params).id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
