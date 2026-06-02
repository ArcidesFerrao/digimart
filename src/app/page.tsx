import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db as prisma } from "@/lib/prisma";
import {
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Download,
  ArrowRight,
  Zap,
  Globe,
  Shield,
} from "lucide-react";

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { isActive: true },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          username: true,
          whatsapp: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="teal" className="mb-6">
                Marketplace Digital para Moçambique
              </Badge>
              <h1 className="font-bebas text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-wide mb-6">
                VENDA SEUS
                <br />
                <span className="text-teal">PRODUTOS</span>
                <br />
                DIGITAIS
              </h1>
              <p className="text-muted text-lg max-w-lg mb-8 leading-relaxed">
                O primeiro marketplace de produtos digitais em Moçambique. Venda
                eBooks, templates, cursos e mais — tudo em Metical (MZN) via
                WhatsApp.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button size="lg" className="gap-2">
                    Explorar Produtos
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="lg" variant="outline" className="gap-2">
                    Tornar-se Vendedor
                    <Zap className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-transparent rounded-3xl" />
                <div className="grid grid-cols-2 gap-4 p-4">
                  {products.slice(0, 4).map((product, i) => (
                    <div
                      key={product.id}
                      className={`bg-surface border border-border rounded-xl overflow-hidden ${
                        i % 2 === 1 ? "mt-8" : ""
                      }`}
                    >
                      <div className="relative aspect-square">
                        <Image
                          src={product.coverImage}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-teal font-bold">
                          {new Intl.NumberFormat("pt-MZ", {
                            style: "currency",
                            currency: "MZN",
                            minimumFractionDigits: 0,
                          }).format(product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-mono text-xs uppercase tracking-wider text-teal mb-4 block">
              Como Funciona
            </span>
            <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide">
              FLUXO DE <span className="text-teal">COMPRA</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: ShoppingBag,
                step: "01",
                title: "Descobre",
                desc: "Navega pela plataforma e encontra o produto digital que precisas.",
              },
              {
                icon: MessageCircle,
                step: "02",
                title: "Contacta",
                desc: "Clica em Comprar via WhatsApp e fala directamente com o vendedor.",
              },
              {
                icon: CreditCard,
                step: "03",
                title: "Paga",
                desc: "Efectua o pagamento via M-Pesa, e-Mola ou transferência bancária.",
              },
              {
                icon: Download,
                step: "04",
                title: "Recebe",
                desc: "Após confirmação do pagamento, recebe o link para download do produto.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-teal bg-surface flex items-center justify-center group-hover:bg-teal/10 transition-colors">
                  <item.icon className="h-6 w-6 text-teal" />
                </div>
                <span className="font-mono text-xs text-teal mb-2 block">
                  {item.step}
                </span>
                <h3 className="font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-teal mb-4 block">
                Destaques
              </span>
              <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide">
                PRODUTOS EM <span className="text-teal">DESTAQUE</span>
              </h2>
            </div>
            <Link href="/products">
              <Button variant="outline" className="hidden sm:flex gap-2">
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group"
              >
                <div className="bg-surface border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-teal/50">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={product.coverImage}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2 group-hover:text-teal transition-colors">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-teal font-bold">
                        {new Intl.NumberFormat("pt-MZ", {
                          style: "currency",
                          currency: "MZN",
                          minimumFractionDigits: 0,
                        }).format(product.price)}
                      </span>
                      <span className="text-xs text-muted">
                        {product.seller.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                Ver Todos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* For Sellers CTA */}
      <section className="py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl tracking-wide mb-6">
                ÉS UM <span className="text-teal">CRIADOR?</span>
              </h2>
              <p className="text-muted text-lg max-w-2xl mx-auto mb-8">
                Junta-te à comunidade de criadores moçambicanos. Vende os teus
                produtos digitais de forma simples e sem complicações.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Globe className="h-4 w-4 text-teal" />
                  <span>Alcance nacional</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Shield className="h-4 w-4 text-teal" />
                  <span>Sem taxas no MVP</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted">
                  <Zap className="h-4 w-4 text-teal" />
                  <span>Setup em minutos</span>
                </div>
              </div>
              <Link href="/auth/register">
                <Button size="lg" className="gap-2">
                  Começar a Vender
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
