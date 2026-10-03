// check-db.js
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const url = process.env.DATABASE_URL;
console.log("Host:", new URL(url).host); // não imprime a password

const adapter = new PrismaPg({ connectionString: url });
const prisma = new PrismaClient({ adapter });

console.log("Total:", await prisma.user.count());
console.log(
  "Não verificados:",
  await prisma.user.count({ where: { isVerified: false } }),
);
await prisma.$disconnect();
