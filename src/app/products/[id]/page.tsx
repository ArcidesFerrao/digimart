import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db as prisma } from "@/lib/prisma";
import { formatPrice, generateWhatsAppLink } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/products/product-card";
import {
  MessageCircle,
  ArrowLeft,
  Calendar,
  User,
  Tag,
  ExternalLink,
} from "lucide-react";
// import type { Category } from "@prisma/client/edge";
type Category = "EBOOK" | "TEMPLATE" | "COURSE" | "OTHER";
async function getProduct(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          username: true,
          whatsapp: true,
          bio: true,
          avatar: true,
        },
      },
    },
  });
}

async function getRelatedProducts(category: Category, excludeId: string) {
  return prisma.product.findMany({
    where: {
      category,
      isActive: true,
      id: { not: excludeId },
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          username: true,
          whatsapp: true,
          avatar: true,
          bio: true,
        },
      },
    },
    take: 4,
  });
}

const categoryLabels: Record<string, string> = {
  EBOOK: "eBook",
  TEMPLATE: "Template",
  COURSE: "Curso",
  OTHER: "Outro",
};

const categoryVariants: Record<string, "teal" | "warn" | "green" | "default"> =
  {
    EBOOK: "teal",
    TEMPLATE: "warn",
    COURSE: "green",
    OTHER: "default",
  };

type Params = Promise<{ id: string }>;
export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.title} — DigiMart`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.category,
    product.id,
  );
  const whatsappLink = generateWhatsAppLink(
    product.seller.whatsapp,
    product.title,
    product.price,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos produtos
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-surface">
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <Badge
            variant={categoryVariants[product.category] || "default"}
            className="self-start mb-4"
          >
            {categoryLabels[product.category] || product.category}
          </Badge>

          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide mb-4">
            {product.title}
          </h1>

          <p className="text-3xl font-bold text-teal mb-6">
            {formatPrice(product.price)}
          </p>

          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-3">Descrição</h3>
            <p className="text-muted leading-relaxed whitespace-pre-wrap">
              {product.description}
            </p>
          </div>

          {/* Seller Info */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-foreground mb-4">Vendedor</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center overflow-hidden">
                {product.seller.avatar ? (
                  <Image
                    src={product.seller.avatar}
                    alt={product.seller.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-muted" />
                )}
              </div>
              <div>
                <Link
                  href={`/sellers/${product.seller.username}`}
                  className="font-semibold text-foreground hover:text-teal transition-colors"
                >
                  {product.seller.name}
                </Link>
                {product.seller.bio && (
                  <p className="text-sm text-muted">{product.seller.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-muted mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                Publicado em{" "}
                {new Date(product.createdAt).toLocaleDateString("pt-MZ", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{categoryLabels[product.category]}</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button size="lg" className="w-full gap-2 text-base">
              <MessageCircle className="h-5 w-5" />
              Comprar via WhatsApp
            </Button>
          </a>
          <p className="text-xs text-muted text-center mt-3">
            Serás redireccionado para o WhatsApp do vendedor com uma mensagem
            pré-preenchida.
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-12">
          <h2 className="font-bebas text-3xl tracking-wide mb-8">
            PRODUTOS <span className="text-teal">RELACIONADOS</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
