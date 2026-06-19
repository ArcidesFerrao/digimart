import { auth } from "@/lib/auth";
import { db as prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  Plus,
  Eye,
  Pencil,
  Trash2,
  TrendingUp,
  Store,
} from "lucide-react";
import { Product } from "@/types";
import { DeleteProductButton } from "@/components/ui/delete-product-btn";
import { CopyFileLinkButton } from "@/components/ui/copyFileButton";

async function getSellerProducts(userId: string): Promise<Product[]> {
  return prisma.product.findMany({
    where: { sellerId: userId },
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
}

const categoryLabels: Record<string, string> = {
  EBOOK: "eBook",
  TEMPLATE: "Template",
  COURSE: "Curso",
  OTHER: "Outro",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const products = await getSellerProducts(session.user.id);
  const activeProducts = products.filter((p) => p.isActive);
  const inactiveProducts = products.filter((p) => !p.isActive);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-teal mb-2 block">
            Painel
          </span>
          <h1 className="font-bebas text-4xl tracking-wide">
            OS MEUS <span className="text-teal">PRODUTOS</span>
          </h1>
        </div>
        <Link href="/dashboard/products/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-5 w-5 text-teal" />
            <span className="text-sm text-muted">Total</span>
          </div>
          <p className="font-bebas text-3xl text-foreground">
            {products.length}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="h-5 w-5 text-green" />
            <span className="text-sm text-muted">Activos</span>
          </div>
          <p className="font-bebas text-3xl text-green">
            {activeProducts.length}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-5 w-5 text-warn" />
            <span className="text-sm text-muted">Inactivos</span>
          </div>
          <p className="font-bebas text-3xl text-warn">
            {inactiveProducts.length}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <Store className="h-5 w-5 text-teal" />
            <span className="text-sm text-muted">Loja</span>
          </div>
          <Link
            href={`/sellers/${session.user.username}`}
            className="text-sm text-teal hover:underline"
          >
            Ver público
          </Link>
        </div>
      </div>

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="bg-surface border border-border border-dashed rounded-xl p-12 text-center">
          <Package className="h-12 w-12 text-muted mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">
            Ainda não tens produtos
          </h3>
          <p className="text-muted text-sm mb-6">
            Começa a vender criando o teu primeiro produto digital.
          </p>
          <Link href="/dashboard/products/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Produto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Produto
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Categoria
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Preço
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Estado
                  </th>
                  <th className="text-right font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Acções
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-background/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-border overflow-hidden flex-shrink-0">
                          <img
                            src={product.coverImage}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-foreground text-sm truncate max-w-[200px]">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">
                        {categoryLabels[product.category] || product.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-teal font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs ${
                          product.isActive ? "text-green" : "text-muted"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.isActive ? "bg-green" : "bg-muted"
                          }`}
                        />
                        {product.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <CopyFileLinkButton fileUrl={product.fileUrl} />
                        <Link href={`/products/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <DeleteProductButton productId={product.id} />
                        {/* <form
                          action={`/api/products/${product.id}`}
                          method="DELETE"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            if (
                              !confirm(
                                "Tens a certeza que queres eliminar este produto?",
                              )
                            )
                              return;
                            await fetch(`/api/products/${product.id}`, {
                              method: "DELETE",
                            });
                            window.location.reload();
                          }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
                            type="submit"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
