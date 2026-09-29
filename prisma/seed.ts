import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

console.log(process.env.DATABASE_URL?.replace(/:[^:@]+@/, ":****@"));
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({adapter});

async function main() {
  const hashedPassword = await bcrypt.hash("adminevolure", 10);

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin DigiMart",
      email: "admin@digimart.mz",
      password: hashedPassword,
      username: "admin",
      whatsapp: "258841234567",
      bio: "Administrador da plataforma DigiMart",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      isVerified: true,
      isAdmin: true,
    },
  });

  // Seller user
  const seller = await prisma.user.create({
    data: {
      name: "Ana Silva",
      email: "ana@digimart.mz",
      password: hashedPassword,
      username: "anasilva",
      whatsapp: "258841234568",
      bio: "Designer e criadora de templates digitais",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
      isVerified: true,
    },
  });

  // Create products with multiple images
  await prisma.product.createMany({
    data: [
      {
        title: "Template de CV Profissional",
        description: "Template moderno e elegante para currículos. Editável em Canva e Word. Inclui 3 variações de cores.\n\nO que inclui:\n- 3 designs de CV\n- Carta de apresentação\n- Guia de uso\n- Ficheiros em Word e PDF",
        price: 500,
        category: "TEMPLATE",
        coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&q=80",
          "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
          "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&q=80",
        ],
        fileUrl: "https://drive.google.com/example",
        sellerId: seller.id,
      },
      {
        title: "Guia de Marketing Digital",
        description: "eBook completo com estratégias práticas de marketing digital adaptadas ao mercado moçambicano.\n\nCapítulos:\n1. Introdução ao Marketing Digital\n2. Redes Sociais\n3. SEO Local\n4. Email Marketing\n5. Métricas e Análise",
        price: 1200,
        category: "EBOOK",
        coverImage: "https://images.unsplash.com/photo-1553729459-afe8f2e90c4e?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
          "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80",
        ],
        fileUrl: "https://drive.google.com/example2",
        sellerId: seller.id,
      },
      {
        title: "Curso de Design Gráfico Básico",
        description: "Curso completo de 10 módulos sobre design gráfico com Canva. Inclui certificado de conclusão.\n\nMódulos:\n1. Fundamentos do Design\n2. Tipografia\n3. Cores e Harmonia\n4. Layout e Composição\n5. Branding\n6. Social Media Design\n7. Apresentações\n8. Design para Print\n9. Portfolio\n10. Freelancing",
        price: 3500,
        category: "COURSE",
        coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
          "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80",
          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80",
        ],
        fileUrl: "https://drive.google.com/example3",
        sellerId: seller.id,
      },
      {
        title: "Pack de Ícones Minimalistas",
        description: "500 ícones minimalistas em formato SVG e PNG. Perfeitos para websites, apps e apresentações.\n\nCategorias:\n- UI/UX\n- Negócios\n- Tecnologia\n- Social Media\n- E-commerce",
        price: 800,
        category: "OTHER",
        coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
        ],
        fileUrl: "https://drive.google.com/example4",
        sellerId: seller.id,
      },
    ],
  });

  console.log("Seed concluído!");
  console.log("Admin: admin@digimart.mz / password123");
  console.log("Seller: ana@digimart.mz / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
