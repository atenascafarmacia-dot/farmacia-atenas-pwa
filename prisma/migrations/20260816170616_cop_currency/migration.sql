-- AlterEnum
ALTER TYPE "Currency" ADD VALUE 'COP';

-- AlterTable
ALTER TABLE "Setting" ALTER COLUMN "usdVesRate" DROP NOT NULL,
                      ADD COLUMN "usdCopRate" DOUBLE PRECISION;
