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
  CreditCard,
  CheckCircle,
  Smartphone,
  ImageIcon,
} from "lucide-react";
import { Category } from "@prisma/client";

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

async function getRelatedProducts(category: string, excludeId: string) {
  return prisma.product.findMany({
    where: {
      category: category as Category,
      isActive: true,
      id: { not: excludeId },
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          bio: true,
          username: true,
          whatsapp: true,
          avatar: true,
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const product = await getProduct((await params).id);
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.title} — DigiMart`,
    description: product.description.slice(0, 160),
  };
}
type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const product = await getProduct((await params).id);
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

  const paidMessage = `Olá! Já efectuei o pagamento de ${formatPrice(product.price)} pelo produto "${product.title}" via M-Pesa/e-Mola. Podes confirmar e enviar o produto?`;
  const paidWhatsAppLink = `https://wa.me/${product.seller.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(paidMessage)}`;

  const allImages = [product.coverImage, ...(product.images || [])].filter(
    Boolean,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar aos produtos
      </Link>

      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image - Square */}
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-border bg-surface">
            <Image
              src={product.coverImage}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Additional Images Grid - natural ratios */}
          {product.images && product.images.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="h-4 w-4 text-teal" />
                <h3 className="font-mono text-xs uppercase tracking-wider text-muted">
                  Galeria
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-xl overflow-hidden border border-border bg-surface group"
                  >
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "75%" }}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} - imagem ${idx + 2}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 33vw, 250px"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  href={`/sellers/${encodeURIComponent(product.seller.username)}`}
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

          {/* Purchase Options */}
          <div className="space-y-4">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <a
                href={`/api/products/${product.id}/whatsapp`}
                target="_blank"
                rel="noopener"
                // size="lg"
                className="w-full gap-2 text-base"
              >
                <MessageCircle className="h-5 w-5" />
                Comprar pelo WhatsApp
              </a>
              <Button size="lg" className="w-full gap-2 text-base">
                <MessageCircle className="h-5 w-5" />
                Comprar via WhatsApp
              </Button>
            </a>
            <p className="text-xs text-muted text-center">
              Fala com o vendedor para combinar o pagamento e receber o produto.
            </p>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted uppercase tracking-wider">
                ou
              </span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="bg-teal/5 border border-teal/20 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-teal" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    Já efectuaste o pagamento?
                  </h4>
                  <p className="text-xs text-muted mt-1">
                    Se já pagaste via M-Pesa ou e-Mola, confirma com o vendedor
                    para receber o produto.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted">
                  <CheckCircle className="h-4 w-4 text-teal flex-shrink-0" />
                  <span>
                    1. Efectua o pagamento para:{" "}
                    <strong className="text-foreground">
                      {product.seller.whatsapp}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <CheckCircle className="h-4 w-4 text-teal flex-shrink-0" />
                  <span>2. Guarda o comprovativo de pagamento</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted">
                  <CheckCircle className="h-4 w-4 text-teal flex-shrink-0" />
                  <span>3. Clica no botão abaixo para confirmar</span>
                </div>
              </div>

              <a
                href={paidWhatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4"
              >
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <Smartphone className="h-5 w-5" />
                  Confirmar Pagamento no WhatsApp
                </Button>
              </a>
            </div>
          </div>
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
