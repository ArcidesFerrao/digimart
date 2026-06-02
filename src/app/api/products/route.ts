import { NextRequest, NextResponse } from "next/server";
import { db as  prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  category: z.enum(["EBOOK", "TEMPLATE", "COURSE", "OTHER"]),
  coverImage: z.string().url(),
  fileUrl: z.string().url().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sellerId = searchParams.get("sellerId");

  const where: any = { isActive: true };

  if (category && category !== "ALL") {
    where.category = category;
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  if (sellerId) {
    where.sellerId = sellerId;
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          username: true,
          whatsapp: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = productSchema.parse(body);

    // TODO: Get sellerId from session
    const product = await prisma.product.create({
      data: {
        ...validated,
        sellerId: body.sellerId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
