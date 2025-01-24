/*
  Warnings:

  - You are about to drop the column `manufacturerId` on the `Airplane` table. All the data in the column will be lost.
  - Added the required column `manufacturer` to the `Airplane` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Airplane" DROP CONSTRAINT "Airplane_manufacturerId_fkey";

-- AlterTable
ALTER TABLE "Airplane" DROP COLUMN "manufacturerId",
ADD COLUMN     "manufacturer" VARCHAR NOT NULL;
