import { notFound } from "next/navigation";
import Image from "next/image";
import { db as prisma } from "@/lib/prisma";
import { ProductGrid } from "@/components/products/product-grid";
import { User, MessageCircle, Package } from "lucide-react";

async function getSeller(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      whatsapp: true,
      products: {
        where: { isActive: true },
        include: {
          seller: {
            select: {
              bio: true,
              id: true,
              name: true,
              username: true,
              whatsapp: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  const seller = await getSeller(params.username);
  if (!seller) return { title: "Vendedor não encontrado" };
  return {
    title: `${seller.name} — DigiMart`,
    description: seller.bio || `Perfil de ${seller.name} no DigiMart`,
  };
}

export default async function SellerPage({
  params,
}: {
  params: { username: string };
}) {
  const seller = await getSeller(params.username);

  if (!seller) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header */}
      <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-border flex items-center justify-center overflow-hidden flex-shrink-0">
            {seller.avatar ? (
              <Image
                src={seller.avatar}
                alt={seller.name}
                width={96}
                height={96}
                className="object-cover"
              />
            ) : (
              <User className="h-12 w-12 text-muted" />
            )}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="font-bebas text-4xl tracking-wide mb-2">
              {seller.name}
            </h1>
            <p className="font-mono text-sm text-teal mb-3">
              @{seller.username}
            </p>
            {seller.bio && (
              <p className="text-muted max-w-xl mb-4">{seller.bio}</p>
            )}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-muted">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-teal" />
                <span>{seller.products.length} produto(s)</span>
              </div>
              <a
                href={`https://wa.me/${seller.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-teal hover:underline"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contactar via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div>
        <h2 className="font-bebas text-3xl tracking-wide mb-8">
          PRODUTOS DO <span className="text-teal">VENDEDOR</span>
        </h2>
        <ProductGrid products={seller.products} />
      </div>
    </div>
  );
}
