"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageCircle,
  Smartphone,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function VerifyPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (session?.user?.isVerified) {
      router.push("/dashboard");
    }
  }, [session, router]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao verificar");
        return;
      }

      toast.success("Conta verificada com sucesso!");
      await update();
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao verificar código");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!session?.user?.id) return;

    setResending(true);
    try {
      const res = await fetch("/api/verify", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao reenviar");
        return;
      }

      toast.success("Novo código enviado! Verifica o teu email/WhatsApp.");
      if (data.debugCode) {
        console.log("Código de debug:", data.debugCode);
      }
    } catch (error) {
      toast.error("Erro ao reenviar código");
    } finally {
      setResending(false);
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-teal animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <ShoppingBag className="h-8 w-8 text-teal" />
            <span className="font-bebas text-3xl tracking-wider text-foreground">
              DIGI<span className="text-teal">MART</span>
            </span>
          </Link>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warn/10 border border-warn/25 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-warn" />
          </div>
          <h1 className="font-bebas text-4xl tracking-wide mb-2">
            VERIFICAR <span className="text-teal">CONTA</span>
          </h1>
          <p className="text-muted text-sm">
            A tua conta precisa de ser verificada antes de começares a vender.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-surface border border-border rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-teal" />
            Como recebes o código?
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-4 w-4 text-teal" />
              </div>
              <div>
                <p className="text-sm text-foreground font-medium">WhatsApp</p>
                <p className="text-xs text-muted">
                  Enviámos uma mensagem com o código para o teu WhatsApp (
                  {session.user.whatsapp || "número registado"}).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-4 w-4 text-teal" />
              </div>
              <div>
                <p className="text-sm text-foreground font-medium">Email</p>
                <p className="text-xs text-muted">
                  Também enviámos o código para o teu email (
                  {session.user.email}).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warn/10 flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-warn" />
              </div>
              <div>
                <p className="text-sm text-foreground font-medium">Validade</p>
                <p className="text-xs text-muted">
                  O código é válido por 24 horas. Se expirar, podes solicitar um
                  novo.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full bg-border flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {session.user.name}
              </p>
              <p className="text-xs text-muted">{session.user.email}</p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Código de Verificação
              </label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-2xl tracking-[0.5em] font-mono"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || code.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />A
                  verificar...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Verificar Conta
                </>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center space-y-3">
          <button
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-teal hover:underline disabled:opacity-50"
          >
            {resending ? "A enviar..." : "Não recebeste? Reenviar código"}
          </button>
          <div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-xs text-muted hover:text-foreground"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
