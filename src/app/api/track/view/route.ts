// app/api/track/view/route.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db as prisma } from "@/lib/prisma";
import { isBot, track } from "@/lib/track";

export async function POST(req: NextRequest) {
  if (isBot(req.headers.get("user-agent"))) return NextResponse.json({ ok: true });

  const { productId } = await req.json();
  if (!productId) return NextResponse.json({ ok: false }, { status: 400 });

  const sid = req.cookies.get("dm_sid")?.value ?? randomUUID();

  // Não conta a mesma sessão + produto mais de uma vez em 30 min
  const recent = await prisma.productEvent.findFirst({
    where: {
      type: "VIEW",
      productId,
      sessionId: sid,
      createdAt: { gt: new Date(Date.now() - 30 * 60_000) },
    },
    select: { id: true },
  });
  if (!recent) await track({ type: "VIEW", productId, sessionId: sid });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("dm_sid", sid, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}