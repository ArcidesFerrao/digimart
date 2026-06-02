"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    whatsapp: "",
    bio: "",
  });

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("As passwords não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("A password deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          username: formData.username,
          whatsapp: formData.whatsapp,
          bio: formData.bio || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao criar conta");
        return;
      }

      toast.success("Conta criada com sucesso!");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-teal" />
            <span className="font-bebas text-3xl tracking-wider text-foreground">
              DIGI<span className="text-teal">MART</span>
            </span>
          </Link>
          <h1 className="font-bebas text-4xl tracking-wide mb-2">
            CRIAR <span className="text-teal">CONTA</span>
          </h1>
          <p className="text-muted text-sm">
            Regista-te como vendedor e começa a vender os teus produtos digitais
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Nome completo *
              </label>
              <Input
                name="name"
                placeholder="Ana Silva"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Username *
              </label>
              <Input
                name="username"
                placeholder="anasilva"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <Input
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password *
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Confirmar Password *
              </label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Bio (opcional)
            </label>
            <Textarea
              name="bio"
              placeholder="Fala um pouco sobre ti e o que vendes..."
              value={formData.bio}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                A criar conta...
              </>
            ) : (
              "Criar Conta"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted text-sm">
            Já tens conta?{" "}
            <Link href="/auth/login" className="text-teal hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
