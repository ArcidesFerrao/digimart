"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  Copy,
  Check,
  Loader2,
  MessageCircle,
  Trash2,
  ExternalLink,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Product {
  id: string;
  title: string;
  price: number;
  fileUrl: string | null;
}

interface DownloadLink {
  id: string;
  token: string;
  buyerPhone: string | null;
  buyerName: string | null;
  expiresAt: string;
  maxDownloads: number;
  downloadCount: number;
  isActive: boolean;
  createdAt: string;
  product: { title: string };
}

export default function LinksPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [links, setLinks] = useState<DownloadLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    productId: "",
    buyerPhone: "",
    buyerName: "",
    expiresInHours: "48",
    maxDownloads: "3",
    ref: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [productsRes, linksRes] = await Promise.all([
        fetch("/api/products?sellerId=" + session?.user?.id),
        fetch("/api/download/list"),
      ]);

      if (productsRes.ok) {
        const allProducts = await productsRes.json();
        setProducts(allProducts.filter((p: Product) => p.fileUrl));
      }

      if (linksRes.ok) {
        setLinks(await linksRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.productId) {
      toast.error("Selecciona um produto");
      return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: formData.productId,
          buyerPhone: formData.buyerPhone || undefined,
          buyerName: formData.buyerName || undefined,
          expiresInHours: parseInt(formData.expiresInHours),
          maxDownloads: parseInt(formData.maxDownloads),
          ref: formData.ref || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao criar link");
        return;
      }

      toast.success("Link criado com sucesso!");
      setLinks((prev) => [
        {
          id: data.token,
          token: data.token,
          buyerPhone: formData.buyerPhone || null,
          buyerName: formData.buyerName || null,
          expiresAt: data.expiresAt,
          maxDownloads: parseInt(formData.maxDownloads),
          downloadCount: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          product: {
            title:
              products.find((p) => p.id === formData.productId)?.title || "",
          },
        },
        ...prev,
      ]);
      setFormData({
        productId: "",
        buyerPhone: "",
        buyerName: "",
        expiresInHours: "48",
        maxDownloads: "3",
        ref: "",
      });
    } catch (error) {
      toast.error("Erro ao criar link");
    } finally {
      setCreating(false);
    }
  }

  function copyLink(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("Link copiado!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function generateWhatsAppMessage(link: DownloadLink): string {
    const productName = link.product.title;
    const url = `${window.location.origin}/api/download/${link.token}`;

    return `Olá! Aqui está o teu link de download para "${productName}":\n\n${url}\n\nEste link expira em ${new Date(link.expiresAt).toLocaleDateString("pt-MZ")} e permite até ${link.maxDownloads} download(s).`;
  }

  async function toggleLinkStatus(linkId: string, currentStatus: boolean) {
    try {
      // We'll need a PATCH endpoint for this, for now just update locally
      toast.info("Funcionalidade em desenvolvimento");
    } catch (error) {
      toast.error("Erro");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-teal mb-2 block">
          Gestão
        </span>
        <h1 className="font-bebas text-4xl tracking-wide">
          LINKS DE <span className="text-teal">DOWNLOAD</span>
        </h1>
      </div>

      {/* Create Link Form */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-teal" />
          Gerar Novo Link
        </h3>

        {products.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-10 w-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">
              Não tens produtos com ficheiro associado. Adiciona um ficheiro ao
              produto primeiro.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              value={formData.ref}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ref: e.target.value.trim().toUpperCase(),
                })
              }
              placeholder="Ref do pedido (ex: K7M2QX)"
              maxLength={6}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Produto *
                </label>
                <Select
                  value={formData.productId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      productId: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Seleccionar produto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {formatPrice(p.price)}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Nome do Comprador
                </label>
                <Input
                  placeholder="Ex: João Silva"
                  value={formData.buyerName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      buyerName: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  WhatsApp do Comprador
                </label>
                <Input
                  placeholder="25884..."
                  value={formData.buyerPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      buyerPhone: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Expira em (horas)
                </label>
                <Select
                  value={formData.expiresInHours}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      expiresInHours: e.target.value,
                    }))
                  }
                >
                  <option value="24">24 horas</option>
                  <option value="48">48 horas</option>
                  <option value="72">72 horas</option>
                  <option value="168">7 dias</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Max. Downloads
                </label>
                <Select
                  value={formData.maxDownloads}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxDownloads: e.target.value,
                    }))
                  }
                >
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={creating || !formData.productId}
              className="gap-2"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              {creating ? "A criar..." : "Gerar Link de Download"}
            </Button>
          </form>
        )}
      </div>

      {/* Links List */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Links Gerados</h3>

        {links.length === 0 ? (
          <div className="bg-surface border border-border border-dashed rounded-xl p-12 text-center">
            <Link2 className="h-10 w-10 text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">
              Ainda não geraste nenhum link de download.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {links.map((link) => {
              const downloadUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/download/${link.token}`;
              const isExpired = new Date(link.expiresAt) < new Date();
              const isExhausted = link.downloadCount >= link.maxDownloads;

              return (
                <div
                  key={link.id}
                  className={`bg-surface border rounded-xl p-5 ${
                    isExpired || isExhausted || !link.isActive
                      ? "border-border/50 opacity-60"
                      : "border-border"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground text-sm">
                          {link.product.title}
                        </h4>
                        <Badge
                          variant={
                            isExpired || isExhausted || !link.isActive
                              ? "default"
                              : "green"
                          }
                        >
                          {isExpired
                            ? "Expirado"
                            : isExhausted
                              ? "Esgotado"
                              : !link.isActive
                                ? "Inactivo"
                                : "Activo"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted mb-2">
                        {link.buyerName && `${link.buyerName} · `}
                        {link.buyerPhone && `${link.buyerPhone} · `}
                        {link.downloadCount}/{link.maxDownloads} downloads ·
                        Expira:{" "}
                        {new Date(link.expiresAt).toLocaleDateString("pt-MZ", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <code className="text-xs text-teal bg-teal/5 px-2 py-1 rounded block truncate">
                        {downloadUrl}
                      </code>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => copyLink(downloadUrl, link.id)}
                      >
                        {copiedId === link.id ? (
                          <Check className="h-4 w-4 text-green" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copiedId === link.id ? "Copiado" : "Copiar"}
                      </Button>

                      <a
                        href={`https://wa.me/${link.buyerPhone?.replace(/\D/g, "") || ""}?text=${encodeURIComponent(
                          generateWhatsAppMessage(link),
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          !link.buyerPhone ? "pointer-events-none" : ""
                        }
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          disabled={!link.buyerPhone}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Enviar
                        </Button>
                      </a>

                      <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
