"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email ou password incorrectos");
      } else {
        toast.success("Login efectuado com sucesso!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-teal" />
            <span className="font-bebas text-3xl tracking-wider text-foreground">
              DIGI<span className="text-teal">MART</span>
            </span>
          </Link>
          <h1 className="font-bebas text-4xl tracking-wide mb-2">
            ENTRAR NA <span className="text-teal">CONTA</span>
          </h1>
          <p className="text-muted text-sm">
            Acede ao teu painel de vendedor
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                A entrar...
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted text-sm">
            Não tens conta?{" "}
            <Link href="/auth/register" className="text-teal hover:underline">
              Regista-te como vendedor
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
