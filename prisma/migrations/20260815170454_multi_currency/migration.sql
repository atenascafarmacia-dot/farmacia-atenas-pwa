-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'VES');

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "usdVesRate" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "currency" "Currency" NOT NULL DEFAULT 'USD',
                    ADD COLUMN "exchangeRate" DOUBLE PRECISION;
