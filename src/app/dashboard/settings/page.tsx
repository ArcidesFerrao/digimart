"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/lib/uploadthing";
import { Loader2, User, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  name: string;
  email: string;
  username: string;
  whatsapp: string;
  bio: string | null;
  avatar: string | null;
}

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    bio: "",
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchUser();
    }
  }, [session]);

  async function fetchUser() {
    try {
      const res = await fetch(`/api/sellers/${session?.user?.username}`);
      if (!res.ok) return;
      const data = await res.json();
      setFormData({
        name: data.name || "",
        whatsapp: data.whatsapp || "",
        bio: data.bio || "",
      });
      setAvatar(data.avatar || "");
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          avatar: avatar || null,
        }),
      });

      if (!res.ok) {
        toast.error("Erro ao actualizar perfil");
        return;
      }

      await update();
      toast.success("Perfil actualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao actualizar perfil");
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

  return (
    <div>
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-teal mb-2 block">
          Configurações
        </span>
        <h1 className="font-bebas text-4xl tracking-wide">
          PERFIL DO <span className="text-teal">VENDEDOR</span>
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Foto de Perfil
          </label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-border flex items-center justify-center overflow-hidden flex-shrink-0">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-8 w-8 text-muted" />
              )}
            </div>
            <div>
              {avatar ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">Imagem carregada</span>
                  <button
                    type="button"
                    onClick={() => setAvatar("")}
                    className="text-danger text-sm hover:underline"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setAvatar(res[0].ufsUrl || res[0].url);
                      toast.success("Avatar carregado!");
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
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nome *
          </label>
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            WhatsApp * (com código do país)
          </label>
          <Input
            name="whatsapp"
            placeholder="258841234567"
            value={formData.whatsapp}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-muted mt-1">
            Formato: 258 + número (ex: 258841234567)
          </p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Bio
          </label>
          <Textarea
            name="bio"
            placeholder="Fala um pouco sobre ti..."
            value={formData.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* Submit */}
        <div className="pt-4">
          <Button type="submit" size="lg" className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                A guardar...
              </>
            ) : (
              "Guardar Alterações"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
