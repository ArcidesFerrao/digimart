// src/app/api/admin/funnel/route.ts
import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const rows = await prisma.$queryRaw<
    {
      title: string;
      visitantes: number;
      cliques: number;
      links: number;
      downloads: number;
    }[]
  >`
    SELECT
      p.title,
      COUNT(DISTINCT e."sessionId") FILTER (WHERE e.type = 'VIEW')::int           AS visitantes,
      COUNT(DISTINCT e.ref)         FILTER (WHERE e.type = 'WHATSAPP_CLICK')::int AS cliques,
      COUNT(DISTINCT e.ref)         FILTER (WHERE e.type = 'LINK_GENERATED')::int AS links,
      COUNT(DISTINCT e.ref)         FILTER (WHERE e.type = 'DOWNLOAD')::int       AS downloads
    FROM "ProductEvent" e
    JOIN "Product" p ON p.id = e."productId"
    WHERE e."createdAt" > ${since}
    GROUP BY p.title
    ORDER BY visitantes DESC
  `;

  const recent = await prisma.productEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { product: { select: { title: true } } },
  });

  return NextResponse.json({ rows, recent });
}