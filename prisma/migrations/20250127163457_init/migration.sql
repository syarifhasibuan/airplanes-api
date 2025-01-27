-- CreateTable
CREATE TABLE "Airplane" (
    "id" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Airplane_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Airplane_slug_key" ON "Airplane"("slug");
