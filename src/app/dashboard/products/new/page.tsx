"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { UploadButton } from "@/lib/uploadthing";
import { ArrowLeft, Loader2, ImageIcon, FileUp, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [fileUrl, setFileUrl] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "OTHER",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!coverImage) {
      toast.error("Por favor, faz upload da imagem de capa principal");
      return;
    }

    if (!session?.user?.id) {
      toast.error("Precisas de estar autenticado");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          category: formData.category,
          coverImage,
          images: images.length > 0 ? images : undefined,
          fileUrl: fileUrl || undefined,
          sellerId: session.user.id,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Erro ao criar produto");
        return;
      }

      toast.success("Produto criado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted hover:text-teal transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        <h1 className="font-bebas text-4xl tracking-wide">
          NOVO <span className="text-teal">PRODUTO</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Título *</label>
          <Input name="title" placeholder="Ex: Template de CV Profissional" value={formData.title} onChange={handleChange} required />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Descrição *</label>
          <Textarea name="description" placeholder="Descreve o teu produto em detalhe..." value={formData.description} onChange={handleChange} required rows={5} />
        </div>

        {/* Price & Category */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Preço (MZN) *</label>
            <Input name="price" type="number" min="0" step="0.01" placeholder="500" value={formData.price} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Categoria *</label>
            <Select name="category" value={formData.category} onChange={handleChange} required>
              <option value="EBOOK">eBook</option>
              <option value="TEMPLATE">Template</option>
              <option value="COURSE">Curso</option>
              <option value="OTHER">Outro</option>
            </Select>
          </div>
        </div>

        {/* Cover Image - Main (Square) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imagem de Capa Principal * <span className="text-xs text-muted font-normal">(recomendado: quadrada 1:1)</span>
          </label>
          {coverImage ? (
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-border mb-3">
              <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setCoverImage("")} className="absolute top-2 right-2 bg-danger text-white p-1.5 rounded-full hover:bg-red-600 transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center w-48">
              <ImageIcon className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="text-xs text-muted mb-3">Imagem principal</p>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) { setCoverImage(res[0].ufsUrl || res[0].url); toast.success("Imagem carregada!"); }
                }}
                onUploadError={(error) => { toast.error(`Erro: ${error.message}`); }}
                appearance={{ button: { background: "#00E5CC", color: "#0B1120", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" } }}
              />
            </div>
          )}
        </div>

        {/* Additional Images - 3 optional */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Imagens Adicionais <span className="text-xs text-muted font-normal">(opcional, máx. 3, qualquer tamanho)</span>
          </label>
          <div className="flex flex-wrap gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-40 h-28 rounded-xl overflow-hidden border border-border">
                <img src={img} alt={`Extra ${idx + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-2 right-2 bg-danger text-white p-1 rounded-full hover:bg-red-600 transition-colors">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center w-40 h-28 flex flex-col items-center justify-center">
                <ImageIcon className="h-5 w-5 text-muted mb-2" />
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) { setImages((prev) => [...prev, res[0].ufsUrl || res[0].url]); toast.success("Imagem adicionada!"); }
                  }}
                  onUploadError={(error) => { toast.error(`Erro: ${error.message}`); }}
                  appearance={{ button: { background: "#1e2d45", color: "#F0F4FF", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" } }}
                />
              </div>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Ficheiro do Produto (opcional)</label>
          {fileUrl ? (
            <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileUp className="h-5 w-5 text-teal" />
                <span className="text-sm text-foreground">Ficheiro carregado</span>
              </div>
              <button type="button" onClick={() => setFileUrl("")} className="text-danger text-sm hover:underline">Remover</button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <FileUp className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="text-sm text-muted mb-3">Faz upload do ficheiro digital (PDF, ZIP, etc.)</p>
              <UploadButton
                endpoint="fileUploader"
                onClientUploadComplete={(res) => {
                  if (res?.[0]) { setFileUrl(res[0].ufsUrl || res[0].url); toast.success("Ficheiro carregado!"); }
                }}
                onUploadError={(error) => { toast.error(`Erro: ${error.message}`); }}
                appearance={{ button: { background: "#1e2d45", color: "#F0F4FF", padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" } }}
              />
            </div>
          )}
          <p className="text-xs text-muted mt-2">Ou podes deixar em branco e partilhar o link manualmente via WhatsApp.</p>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />A criar produto...</> : "Criar Produto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
