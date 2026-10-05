-- CreateEnum
CREATE TYPE "FunnelStep" AS ENUM ('VIEW', 'WHATSAPP_CLICK', 'LINK_GENERATED', 'DOWNLOAD');

-- AlterTable
ALTER TABLE "DownloadLink" ADD COLUMN     "ref" TEXT;

-- CreateTable
CREATE TABLE "ProductEvent" (
    "id" TEXT NOT NULL,
    "type" "FunnelStep" NOT NULL,
    "productId" TEXT NOT NULL,
    "sessionId" TEXT,
    "ref" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductEvent_productId_type_createdAt_idx" ON "ProductEvent"("productId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "ProductEvent_ref_idx" ON "ProductEvent"("ref");

-- AddForeignKey
ALTER TABLE "ProductEvent" ADD CONSTRAINT "ProductEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
