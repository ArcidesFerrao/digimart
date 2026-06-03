import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  const id = (await params).id;
  const product = await prisma.product.findUnique({
    where: { id },
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
  { params }: { params: Params }
) {
  try {
  const id = (await params).id;

    const body = await req.json();
    const product = await prisma.product.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params }
) {
  try {
    const id = (await params).id;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
