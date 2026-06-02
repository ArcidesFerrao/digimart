import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Criar vendedor de exemplo
  const hashedPassword = await bcrypt.hash("password123", 10);

  const seller = await prisma.user.create({
    data: {
      name: "Ana Silva",
      email: "ana@digimart.mz",
      password: hashedPassword,
      username: "anasilva",
      whatsapp: "258841234567",
      bio: "Designer e criadora de templates digitais",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
    },
  });

  // Criar produtos de exemplo
  await prisma.product.createMany({
    data: [
      {
        title: "Template de CV Profissional",
        description: "Template moderno e elegante para currículos. Editável em Canva e Word. Inclui 3 variações de cores.",
        price: 500,
        category: "TEMPLATE",
        coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
        fileUrl: "https://drive.google.com/example",
        sellerId: seller.id,
      },
      {
        title: "Guia de Marketing Digital para Pequenos Negócios",
        description: "eBook completo com estratégias práticas de marketing digital adaptadas ao mercado moçambicano.",
        price: 1200,
        category: "EBOOK",
        coverImage: "https://images.unsplash.com/photo-1553729459-afe8f2e90c4e?w=800&q=80",
        fileUrl: "https://drive.google.com/example2",
        sellerId: seller.id,
      },
      {
        title: "Curso de Design Gráfico Básico",
        description: "Curso completo de 10 módulos sobre design gráfico com Canva. Inclui certificado de conclusão.",
        price: 3500,
        category: "COURSE",
        coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
        fileUrl: "https://drive.google.com/example3",
        sellerId: seller.id,
      },
      {
        title: "Pack de Ícones Minimalistas",
        description: "500 ícones minimalistas em formato SVG e PNG. Perfeitos para websites, apps e apresentações.",
        price: 800,
        category: "OTHER",
        coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
        fileUrl: "https://drive.google.com/example4",
        sellerId: seller.id,
      },
    ],
  });

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
