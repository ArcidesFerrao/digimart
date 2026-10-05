import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { track } from "@/lib/track";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { productId, buyerPhone, buyerName, ref, expiresInHours = 48, maxDownloads = 3 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID é obrigatório" }, { status: 400 });
    }

    // Verify the product belongs to the seller
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        sellerId: session.user.id,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    if (!product.fileUrl) {
      return NextResponse.json(
        { error: "Este produto não tem ficheiro associado. Adiciona um ficheiro primeiro." },
        { status: 400 }
      );
    }

    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const downloadLink = await prisma.downloadLink.create({
      data: {
        productId,
        sellerId: session.user.id,
        buyerPhone: buyerPhone || null,
        buyerName: buyerName || null,
        ref: ref || null,  
        expiresAt,
        maxDownloads,
      },
    });

    await track({
  type: "LINK_GENERATED",
  productId,
  ref: ref || undefined,
  userId: session.user.id,
});

    const downloadUrl = `${process.env.NEXTAUTH_URL}/api/download/${downloadLink.token}`;

    return NextResponse.json({
      downloadUrl,
      token: downloadLink.token,
      expiresAt,
      maxDownloads,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao criar link" }, { status: 500 });
  }
}
