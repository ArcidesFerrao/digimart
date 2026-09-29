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

## Funcionalidades

### MVP Completo
- ✅ Registo e login de vendedores
- ✅ **Verificação por código** — novo utilizador recebe código via WhatsApp/Email antes de poder vender
- ✅ Criação e gestão de produtos digitais
- ✅ **4 imagens por produto** — 1 capa principal (quadrada) + 3 adicionais (qualquer ratio)
- ✅ Galeria de imagens na página do produto
- ✅ Listagem pública de produtos com filtros
- ✅ Página de detalhe do produto
- ✅ **Dois fluxos de compra**:
  - "Comprar via WhatsApp" — falar com vendedor para combinar
  - "Já pagaste?" — confirmar pagamento M-Pesa/e-Mola e receber produto
- ✅ **Links temporários de download** — vendedor gera link seguro no dashboard
- ✅ Dashboard do vendedor com estatísticas
- ✅ Perfil público do vendedor
- ✅ Edição de perfil do vendedor
- ✅ Landing page
- ✅ Busca de produtos
- ✅ Upload de imagens e ficheiros via UploadThing
- ✅ **Página de administração** — gestão de utilizadores e produtos

## Fluxos de Compra

### Fluxo 1: WhatsApp Directo
1. Comprador descobre o produto
2. Clica "Comprar via WhatsApp"
3. Vendedor recebe mensagem pré-preenchida
4. Combinam pagamento (M-Pesa, e-Mola, transferência)
5. Vendedor entrega o produto

### Fluxo 2: Pagamento Primeiro
1. Comprador vê o produto
2. Efectua pagamento via M-Pesa/e-Mola para o número do vendedor
3. Guarda o comprovativo
4. Clica "Confirmar Pagamento no WhatsApp"
5. Vendedor confirma e envia link de download

### Fluxo 3: Link de Download (Vendedor)
1. Vendedor vai ao Dashboard → Links de Download
2. Selecciona o produto e preenche dados do comprador
3. Gera link temporário (expira em 24-72h, limite de downloads)
4. Envia link via WhatsApp ao comprador
5. Comprador faz download seguro

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

# 4. Seed da base de dados
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

## Contas de Teste (Seed)

| Tipo | Email | Password |
|------|-------|----------|
| Admin | admin@digimart.mz | password123 |
| Vendedor | ana@digimart.mz | password123 |

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
│   │   │   ├── register/
│   │   │   ├── verify/
│   │   │   ├── download/
│   │   │   ├── users/
│   │   │   └── admin/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── products/new/
│   │   │   ├── products/[id]/edit/
│   │   │   ├── links/
│   │   │   └── settings/
│   │   ├── products/
│   │   │   └── [id]/
│   │   ├── sellers/
│   │   │   └── [username]/
│   │   ├── verify/
│   │   ├── admin/
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
- `/products/[id]` — Detalhe do produto (com galeria)
- `/sellers/[username]` — Perfil público do vendedor
- `/about` — Sobre a plataforma

### Autenticação
- `/auth/login` — Login
- `/auth/register` — Registo
- `/verify` — Verificação de conta (código)

### Vendedor (requer verificação)
- `/dashboard` — Painel do vendedor
- `/dashboard/products/new` — Criar produto (4 imagens)
- `/dashboard/products/[id]/edit` — Editar produto
- `/dashboard/links` — Gerar links de download
- `/dashboard/settings` — Configurações do perfil

### Admin (requer isAdmin)
- `/admin` — Painel de administração

## Próximos Passos

- Integração com API M-Pesa
- Envio real de SMS/WhatsApp para códigos de verificação
- Sistema de avaliações e reviews
- Notificações por email
- Analytics avançados

---

by Evolure Labs · MVP v1.0 · 2026
