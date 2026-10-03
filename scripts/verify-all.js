// verify-all.js
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const r = await prisma.user.updateMany({
  where: { isVerified: false },
  data: { isVerified: true },
});
console.log(r.count, "contas verificadas");
await prisma.$disconnect();
