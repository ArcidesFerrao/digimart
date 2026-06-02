import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <ShoppingBag className="h-5 w-5 text-teal" />
              <span className="font-bebas text-xl tracking-wider text-foreground">
                DIGI<span className="text-teal">MART</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed">
              Marketplace de produtos digitais para criadores moçambicanos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted hover:text-teal transition-colors">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted hover:text-teal transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="text-sm text-muted hover:text-teal transition-colors">
                  Tornar-se Vendedor
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-muted mb-4">
              Informação
            </h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted">Moeda: MZN (Metical)</li>
              <li className="text-sm text-muted">Idioma: Português</li>
              <li className="text-sm text-muted">Pagamento: M-Pesa, e-Mola</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted font-mono">
            by Evolure Labs · MVP v1.0 · 2026
          </p>
          <p className="text-xs text-muted">
            Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
