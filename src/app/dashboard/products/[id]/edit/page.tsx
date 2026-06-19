"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { ArrowLeft, Loader2, ImageIcon, FileUp } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  fileUrl: string | null;
  isActive: boolean;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [coverImage, setCoverImage] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "OTHER",
    isActive: true,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        toast.error("Produto não encontrado");
        router.push("/dashboard");
        return;
      }
      const data = await res.json();
      setProduct(data);
      setCoverImage(data.coverImage);
      setFileUrl(data.fileUrl || "");
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price.toString(),
        category: data.category,
        isActive: data.isActive,
      });
    } catch (error) {
      toast.error("Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          coverImage,
          fileUrl: fileUrl || null,
          isActive: formData.isActive,
        }),
      });

      if (!res.ok) {
        toast.error("Erro ao actualizar produto");
        return;
      }

      toast.success("Produto actualizado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao actualizar produto");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 text-teal animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        <h1 className="font-bebas text-4xl tracking-wide">
          EDITAR <span className="text-teal">PRODUTO</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Título *
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Descrição *
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        {/* Price & Category */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Preço (MZN) *
            </label>
            <Input
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Categoria *
            </label>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="EBOOK">eBook</option>
              <option value="TEMPLATE">Template</option>
              <option value="COURSE">Curso</option>
              <option value="OTHER">Outro</option>
            </Select>
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-3 bg-surface border border-border rounded-xl p-4">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-5 h-5 rounded border-border bg-background text-teal focus:ring-teal"
          />
          <label
            htmlFor="isActive"
            className="text-sm text-foreground cursor-pointer"
          >
            Produto activo (visível na plataforma)
          </label>
        </div>

        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imagem de Capa *
          </label>
          {coverImage ? (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-border mb-3">
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 bg-danger text-white text-xs px-2 py-1 rounded"
              >
                Remover
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <ImageIcon className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted mb-3">
                Faz upload da imagem de capa
              </p>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setCoverImage(res[0].ufsUrl || res[0].url);
                    toast.success("Imagem carregada com sucesso!");
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Erro: ${error.message}`);
                }}
                appearance={{
                  button: {
                    background: "#00E5CC",
                    color: "#0B1120",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Ficheiro do Produto
          </label>
          {fileUrl ? (
            <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-teal" />
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal hover:underline"
                >
                  <span className="text-sm text-foreground">
                    Ficheiro carregado
                  </span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => setFileUrl("")}
                className="text-danger text-sm hover:underline"
              >
                Remover
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <FileUp className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted mb-3">
                Faz upload do ficheiro digital
              </p>
              <UploadButton
                endpoint="fileUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) {
                    setFileUrl(res[0].ufsUrl || res[0].url);
                    toast.success("Ficheiro carregado com sucesso!");
                  }
                }}
                onUploadError={(error) => {
                  toast.error(`Erro: ${error.message}`);
                }}
                appearance={{
                  button: {
                    background: "#1e2d45",
                    color: "#F0F4FF",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                  },
                }}
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 flex gap-4">
          <Button type="submit" size="lg" className="flex-1" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />A guardar...
              </>
            ) : (
              "Guardar Alterações"
            )}
          </Button>
          <Link href="/dashboard">
            <Button type="button" variant="outline" size="lg">
              Cancelar
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
