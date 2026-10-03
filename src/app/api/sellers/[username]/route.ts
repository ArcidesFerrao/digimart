import { NextRequest, NextResponse } from "next/server";
import { db as  prisma } from "@/lib/prisma";
import { decodeParam } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }:  { params: Promise<{ username: string }> }
) {
  const seller = await prisma.user.findUnique({
    where: { username: decodeParam((await params).username) },
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
