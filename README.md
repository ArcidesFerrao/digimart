# DigiMart

Marketplace de produtos digitais para criadores moçambicanos — simples, local e construído para funcionar via WhatsApp.

## Stack Técnica

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS
- **Base de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: NextAuth.js (Credentials)
- **Upload de Ficheiros**: UploadThing
- **Hosting**: Vercel

## Funcionalidades MVP

- ✅ Registo e login de vendedores
- ✅ Criação e gestão de produtos digitais
- ✅ Listagem pública de produtos com filtros
- ✅ Página de detalhe do produto
- ✅ Botão "Comprar via WhatsApp" com mensagem pré-preenchida
- ✅ Dashboard do vendedor
- ✅ Perfil público do vendedor
- ✅ Landing page
- ✅ Busca de produtos
- ✅ Upload de imagens e ficheiros via UploadThing

## Fluxo de Compra

1. Comprador descobre o produto na plataforma
2. Clica em "Comprar via WhatsApp"
3. Vendedor recebe mensagem pré-preenchida no WhatsApp
4. Combinam pagamento (M-Pesa, e-Mola, transferência)
5. Vendedor confirma e entrega o ficheiro

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com as tuas credenciais

# 3. Gerar Prisma Client e migrar base de dados
npx prisma generate
npx prisma migrate dev

# 4. Seed da base de dados (opcional)
npx prisma db seed

# 5. Correr em desenvolvimento
npm run dev
```

## Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/digimart?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
UPLOADTHING_TOKEN="your-uploadthing-token"
```

## Estrutura do Projeto

```
digimart/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── products/
│   │   │   ├── sellers/
│   │   │   ├── uploadthing/
│   │   │   └── register/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── products/new/
│   │   │   ├── products/[id]/edit/
│   │   │   └── settings/
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── sellers/
│   │   │   └── [username]/
│   │   ├── about/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── providers.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── products/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   └── uploadthing.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

## Rotas

### Públicas
- `/` — Landing page
- `/products` — Listagem de produtos
- `/products/[id]` — Detalhe do produto
- `/sellers/[username]` — Perfil público do vendedor
- `/about` — Sobre a plataforma

### Autenticadas (Vendedor)
- `/auth/login` — Login
- `/auth/register` — Registo
- `/dashboard` — Painel do vendedor
- `/dashboard/products/new` — Criar produto
- `/dashboard/products/[id]/edit` — Editar produto
- `/dashboard/settings` — Configurações do perfil

## Próximos Passos

- Integração com M-Pesa API
- Sistema de avaliações e reviews
- Comissão automática da plataforma
- Notificações por email
- Painel de administração

---

by Evolure Labs · MVP v1.0 · 2026
