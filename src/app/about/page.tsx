import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  MessageCircle,
  CreditCard,
  Download,
  Target,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react";

export const metadata = {
  title: "Sobre — DigiMart",
  description:
    "Conheça o DigiMart, o marketplace de produtos digitais para criadores moçambicanos.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <Badge variant="teal" className="mb-6">
          Sobre Nós
        </Badge>
        <h1 className="font-bebas text-5xl sm:text-6xl tracking-wide mb-6">
          O QUE É O <span className="text-teal">DIGIMART</span>?
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
          O DigiMart é um marketplace de produtos digitais construído
          especificamente para o mercado moçambicano. A nossa missão é empoderar
          criadores locais a monetizar o seu conhecimento e talento.
        </p>
      </div>

      {/* Problem & Solution */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-surface border border-border rounded-xl p-8">
          <h2 className="font-bebas text-2xl tracking-wide mb-4 text-danger">
            O PROBLEMA
          </h2>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-danger mt-1">✕</span>
              <span>Não existe um marketplace digital local em MZN</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-danger mt-1">✕</span>
              <span>
                Criadores vendem de forma desorganizada nas redes sociais
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-danger mt-1">✕</span>
              <span>Compradores não têm onde descobrir produtos locais</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-danger mt-1">✕</span>
              <span>
                Integrações de pagamento automático são complexas e caras
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-surface border border-border rounded-xl p-8 border-l-4 border-l-teal">
          <h2 className="font-bebas text-2xl tracking-wide mb-4 text-teal">
            A NOSSA SOLUÇÃO
          </h2>
          <ul className="space-y-3 text-muted">
            <li className="flex items-start gap-3">
              <span className="text-teal mt-1">→</span>
              <span>Plataforma pública de listagem de produtos digitais</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal mt-1">→</span>
              <span>
                Fluxo de compra via WhatsApp — sem gateway de pagamento
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal mt-1">→</span>
              <span>Vendedor confirma pagamento e entrega o ficheiro</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-teal mt-1">→</span>
              <span>Simples de usar, em português, em MZN</span>
            </li>
          </ul>
        </div>
      </div>

      {/* How it Works */}
      <div className="mb-16">
        <h2 className="font-bebas text-3xl tracking-wide text-center mb-10">
          COMO <span className="text-teal">FUNCIONA</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShoppingBag,
              step: "01",
              title: "Descobre",
              desc: "Navega pela plataforma e encontra o produto que precisas.",
            },
            {
              icon: MessageCircle,
              step: "02",
              title: "Contacta",
              desc: "Clica em Comprar via WhatsApp e fala com o vendedor.",
            },
            {
              icon: CreditCard,
              step: "03",
              title: "Paga",
              desc: "Paga via M-Pesa, e-Mola ou transferência bancária.",
            },
            {
              icon: Download,
              step: "04",
              title: "Recebe",
              desc: "Recebe o link de download após confirmação do pagamento.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-surface border border-border rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-teal bg-background flex items-center justify-center">
                <item.icon className="h-5 w-5 text-teal" />
              </div>
              <span className="font-mono text-xs text-teal mb-2 block">
                {item.step}
              </span>
              <h3 className="font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="font-bebas text-3xl tracking-wide text-center mb-10">
          OS NOSSOS <span className="text-teal">VALORES</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Target,
              title: "Foco Local",
              desc: "Construído para o mercado moçambicano, com MZN e português.",
            },
            {
              icon: Users,
              title: "Comunidade",
              desc: "Uma comunidade de criadores que se apoiam mutuamente.",
            },
            {
              icon: TrendingUp,
              title: "Crescimento",
              desc: "Ferramentas simples para escalar o teu negócio digital.",
            },
            {
              icon: Heart,
              title: "Paixão",
              desc: "Feito com amor pela equipa da Evolure Labs.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center">
                <item.icon className="h-6 w-6 text-teal" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-teal/5 border border-teal/20 rounded-xl p-8 text-center">
        <h3 className="font-bebas text-2xl tracking-wide mb-4">
          UMA PLATAFORMA POR <span className="text-teal">EVOLURE LABS</span>
        </h3>
        <p className="text-muted max-w-2xl mx-auto">
          O DigiMart é um projecto da Evolure Labs, com o objectivo de
          impulsionar a economia digital em Moçambique. Acreditamos que o
          conhecimento e a criatividade local merecem uma plataforma própria.
        </p>
      </div>
    </div>
  );
}
