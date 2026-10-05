import { NextRequest, NextResponse } from "next/server";
import { db as prisma } from "@/lib/prisma";
import { isBot, track } from "@/lib/track";

function errorPage(title: string, message: string, color: string): string {
  return `<!DOCTYPE html>
<html lang="pt"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title}</title>
<style>
  body{background:#0B1120;color:#F0F4FF;font-family:'Syne',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;text-align:center;}
  .box{background:#111827;border:1px solid #1e2d45;padding:40px;border-radius:16px;max-width:420px;width:100%;}
  h1{color:${color};font-size:2rem;margin-bottom:16px;font-family:'Bebas Neue',sans-serif;letter-spacing:0.05em;}
  p{color:#8892a4;line-height:1.6;}
  .logo{font-family:'Bebas Neue',sans-serif;font-size:1.5rem;letter-spacing:0.1em;margin-bottom:24px;}
  .logo span{color:#00E5CC;}
</style></head>
<body><div class="box"><div class="logo">DIGI<span>MART</span></div><h1>${title}</h1><p>${message}</p></div></body></html>`;
}

export async function GET(
  req: NextRequest,
  { params }:  { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  try {
    const link = await prisma.downloadLink.findUnique({
      where: { token },
      include: { product: true },
    });

    
    if (!link) {
      return new NextResponse(
        errorPage("Link Inválido", "Este link de download não existe ou foi removido.", "#FF4D6D"),
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }
    if (!isBot(req.headers.get("user-agent"))) {
      await track({ type: "DOWNLOAD", productId: link.productId, ref: link.ref ?? undefined });
    }

    if (!link.isActive) {
      return new NextResponse(
        errorPage("Link Inactivo", "Este link de download foi desactivado pelo vendedor.", "#FFB830"),
        { status: 410, headers: { "Content-Type": "text/html" } }
      );
    }

    if (link.expiresAt < new Date()) {
      return new NextResponse(
        errorPage("Link Expirado", "Este link de download expirou. Contacta o vendedor para um novo link.", "#FFB830"),
        { status: 410, headers: { "Content-Type": "text/html" } }
      );
    }

    if (link.downloadCount >= link.maxDownloads) {
      return new NextResponse(
        errorPage("Downloads Esgotados", "Este link atingiu o limite de downloads. Contacta o vendedor para um novo link.", "#FFB830"),
        { status: 410, headers: { "Content-Type": "text/html" } }
      );
    }

    await prisma.downloadLink.update({
      where: { id: link.id },
      data: { downloadCount: { increment: 1 } },
    });

    return NextResponse.redirect(link.product.fileUrl!, 302);
  } catch (error) {
    console.error(error);
    return new NextResponse(
      errorPage("Erro", "Ocorreu um erro ao processar o download. Tenta novamente mais tarde.", "#FF4D6D"),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}
