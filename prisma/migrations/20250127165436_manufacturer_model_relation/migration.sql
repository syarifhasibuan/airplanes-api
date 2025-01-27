/*
  Warnings:

  - You are about to drop the column `manufacturer` on the `Airplane` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Airplane" DROP COLUMN "manufacturer",
ADD COLUMN     "manufacturerId" TEXT;

-- CreateTable
CREATE TABLE "Manufacturer" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manufacturer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Manufacturer_slug_key" ON "Manufacturer"("slug");

-- AddForeignKey
ALTER TABLE "Airplane" ADD CONSTRAINT "Airplane_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
