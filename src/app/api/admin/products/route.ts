import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

     const [totalProducts, totalDownloads] =
      await Promise.all([
        prisma.product.count(),
        prisma.downloadLink.count(),
      ]);

    const recentProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        seller: {
          select: { name: true, username: true },
        },
      },
    });

    return NextResponse.json({ stats: { totalProducts, totalDownloads }, recentProducts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
