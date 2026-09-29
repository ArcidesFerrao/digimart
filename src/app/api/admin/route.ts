import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const [totalUsers, totalProducts, totalDownloads, verifiedUsers, unverifiedUsers] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.downloadLink.count(),
        prisma.user.count({ where: { isVerified: true } }),
        prisma.user.count({ where: { isVerified: false } }),
      ]);

    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        whatsapp: true,
        isVerified: true,
        isAdmin: true,
        createdAt: true,
        _count: { select: { products: true } },
      },
    });

    const recentProducts = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        seller: {
          select: { name: true, username: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalDownloads,
        verifiedUsers,
        unverifiedUsers,
      },
      recentUsers,
      recentProducts,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
