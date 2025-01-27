/*
  Warnings:

  - Made the column `manufacturerId` on table `Airplane` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Airplane" DROP CONSTRAINT "Airplane_manufacturerId_fkey";

-- AlterTable
ALTER TABLE "Airplane" ALTER COLUMN "manufacturerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Airplane" ADD CONSTRAINT "Airplane_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "Manufacturer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
