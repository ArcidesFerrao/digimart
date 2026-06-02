import { NextRequest, NextResponse } from "next/server";
import { db as  prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  const seller = await prisma.user.findUnique({
    where: { username: params.username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      whatsapp: true,
      products: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!seller) {
    return NextResponse.json({ error: "Seller not found" }, { status: 404 });
  }

  return NextResponse.json(seller);
}
