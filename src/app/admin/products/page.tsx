"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Package,
  Download,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  Trash2,
  Crown,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalDownloads: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

interface AdminProduct {
  id: string;
  title: string;
  price: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  seller: { name: string; username: string };
}

export default function AdminProductPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [products, setProducts] = useState<AdminProduct[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.isAdmin) {
      router.push("/dashboard");
      return;
    }
    fetchData();
  }, [session, status, router]);

  async function fetchData() {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) {
        toast.error("Erro ao carregar dados");
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setProducts(data.recentProducts);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function toggleProductStatus(
    productId: string,
    currentStatus: boolean,
  ) {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (!res.ok) {
        toast.error("Erro");
        return;
      }
      toast.success(`Produto ${!currentStatus ? "activado" : "desactivado"}`);
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isActive: !currentStatus } : p,
        ),
      );
    } catch (error) {
      toast.error("Erro");
    }
  }

  async function deleteProduct(productId: string) {
    if (!confirm("Tens a certeza que queres eliminar este produto?")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Erro");
        return;
      }
      toast.success("Produto eliminado");
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      toast.error("Erro");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal animate-spin" />
      </div>
    );
  }

  if (!session?.user?.isAdmin) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-teal" />
          <Badge variant="teal">Admin</Badge>
        </div>
        <h1 className="font-bebas text-5xl tracking-wide">
          PAINEL DE <span className="text-teal">ADMINISTRAÇÃO</span>
        </h1>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Package className="h-5 w-5 text-warn" />
              <span className="text-sm text-muted">Produtos</span>
            </div>
            <p className="font-bebas text-3xl text-warn">
              {stats.totalProducts}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Download className="h-5 w-5 text-green" />
              <span className="text-sm text-muted">Downloads</span>
            </div>
            <p className="font-bebas text-3xl text-green">
              {stats.totalDownloads}
            </p>
          </div>
        </div>
      )}

      {/* Products */}
      <div>
        <div className="flex justify-between">
          <h2 className="font-bebas text-2xl tracking-wide mb-6">
            PRODUTOS <span className="text-teal">RECENTES</span>
          </h2>
          <Link
            href="/admin/products"
            className="text-sm text-muted hover:text-foreground"
          >
            ver todos
          </Link>
        </div>

        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Produto
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Vendedor
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Preço
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Categoria
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
                    className="border-b border-border/50 last:border-b-0 hover:bg-background/50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground text-sm">
                        {product.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {product.seller.name}
                    </td>
                    <td className="px-6 py-4 text-teal font-semibold text-sm">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="default">{product.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.isActive ? "green" : "default"}>
                        {product.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs gap-1"
                          onClick={() =>
                            toggleProductStatus(product.id, product.isActive)
                          }
                        >
                          {product.isActive ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                          {product.isActive ? "Desactivar" : "Activar"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
