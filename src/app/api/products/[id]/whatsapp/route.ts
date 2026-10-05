// app/api/products/[id]/whatsapp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { db as prisma } from "@/lib/prisma";
import { isBot, track } from "@/lib/track";
import { normalizeMzPhone } from "@/lib/phone";

const makeRef = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id, isActive: true },
    select: { id: true, title: true, seller: { select: { whatsapp: true } } }, // ajusta à tua relação
  });

  if (!product?.seller.whatsapp) return NextResponse.redirect(new URL(`/products`, req.url));
  
  const phone = normalizeMzPhone(product.seller.whatsapp);
    if (!phone) return NextResponse.redirect(new URL(`/products/${id}`, req.url));
 

  const ref = makeRef();

  if (!isBot(req.headers.get("user-agent"))) {
    await track({
      type: "WHATSAPP_CLICK",
      productId: id,
      sessionId: req.cookies.get("dm_sid")?.value,
      ref,
    });
  }

  const text = `Olá! Tenho interesse em "${product.title}". (Ref: ${ref})`;
  return NextResponse.redirect(
    `https://wa.me/${product.seller.whatsapp}?text=${encodeURIComponent(text)}`
  );
}