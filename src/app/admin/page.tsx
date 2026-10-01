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

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalDownloads: number;
  verifiedUsers: number;
  unverifiedUsers: number;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  username: string;
  whatsapp: string;
  isVerified: boolean;
  isAdmin: boolean;
  verificationCode: string | null;
  createdAt: string;
  _count: { products: number };
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

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
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
      const res = await fetch("/api/admin");
      if (!res.ok) {
        toast.error("Erro ao carregar dados");
        return;
      }
      const data = await res.json();
      setStats(data.stats);
      setUsers(data.recentUsers);
      setProducts(data.recentProducts);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserVerification(
    userId: string,
    currentStatus: boolean,
  ) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !currentStatus }),
      });

      if (!res.ok) {
        toast.error("Erro");
        return;
      }
      toast.success(
        `Utilizador ${!currentStatus ? "verificado" : "não verificado"}`,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isVerified: !currentStatus } : u,
        ),
      );
    } catch (error) {
      toast.error("Erro");
    }
  }

  async function toggleAdmin(userId: string, currentStatus: boolean) {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !currentStatus }),
      });

      if (!res.ok) {
        toast.error("Erro");
        return;
      }
      toast.success(`Admin ${!currentStatus ? "concedido" : "revogado"}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isAdmin: !currentStatus } : u,
        ),
      );
    } catch (error) {
      toast.error("Erro");
    }
  }

  async function deleteUser(userId: string) {
    if (!confirm("Tens a certeza?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        toast.error("Erro");
        return;
      }
      toast.success("Eliminado");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      toast.error("Erro");
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
              <Users className="h-5 w-5 text-teal" />
              <span className="text-sm text-muted">Utilizadores</span>
            </div>
            <p className="font-bebas text-3xl text-foreground">
              {stats.totalUsers}
            </p>
          </div>
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
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-green" />
              <span className="text-sm text-muted">Verificados</span>
            </div>
            <p className="font-bebas text-3xl text-green">
              {stats.verifiedUsers}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="h-5 w-5 text-danger" />
              <span className="text-sm text-muted">Pendentes</span>
            </div>
            <p className="font-bebas text-3xl text-danger">
              {stats.unverifiedUsers}
            </p>
          </div>
        </div>
      )}

      {/* Users */}
      <div className="mb-10">
        <h2 className="font-bebas text-2xl tracking-wide mb-6">
          UTILIZADORES <span className="text-teal">RECENTES</span>
        </h2>
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Nome
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Email
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    WhatsApp
                  </th>
                  <th className="text-left font-mono text-xs uppercase tracking-wider text-muted px-6 py-4">
                    Produtos
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
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-background/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground text-sm">
                          {user.name}
                        </span>
                        {user.isAdmin && (
                          <Crown className="h-3.5 w-3.5 text-warn" />
                        )}
                      </div>
                      <span className="text-xs text-muted">
                        @{user.username}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {user.whatsapp}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user._count.products}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.isVerified ? "green" : "warn"}>
                        {user.isVerified ? "Verificado" : "Pendente"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() =>
                            toggleUserVerification(user.id, user.isVerified)
                          }
                        >
                          {user.isVerified ? "Desverificar" : "Verificar"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => toggleAdmin(user.id, user.isAdmin)}
                        >
                          {user.verificationCode}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-danger hover:text-danger hover:bg-danger/10"
                          onClick={() => deleteUser(user.id)}
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

      {/* Products */}
      <div>
        <h2 className="font-bebas text-2xl tracking-wide mb-6">
          PRODUTOS <span className="text-teal">RECENTES</span>
        </h2>
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
