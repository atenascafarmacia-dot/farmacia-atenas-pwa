import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const SELECT_BATCH = {
  id: true,
  lotNumber: true,
  expiresAt: true,
  stock: true,
} as const;

export type ProductBatchDto = {
  id: string;
  lotNumber: string;
  expiresAt: Date | null;
  stock: number;
};

export type BatchWriteData = {
  lotNumber: string;
  expiresAt: Date | null;
  stock: number;
};

export type BatchErrorCode = "DUPLICATE_LOT";

/** Domain error raised while managing batches; carries a code, not UI text. */
export class BatchError extends Error {
  constructor(readonly code: BatchErrorCode) {
    super(code);
    this.name = "BatchError";
  }
}

export const batchRepository = {
  findByProduct: (productId: string): Promise<ProductBatchDto[]> =>
    prisma.productBatch.findMany({
      where: { productId },
      select: SELECT_BATCH,
      orderBy: { expiresAt: "asc" },
    }),

  /**
   * Registers a batch as a merchandise entry: creates the lot and increments
   * Product.stock by its units in the same transaction.
   */
  createWithStockEntry: async (
    productId: string,
    data: BatchWriteData,
  ): Promise<ProductBatchDto> => {
    try {
      return await prisma.$transaction(async (tx) => {
        const batch = await tx.productBatch.create({
          data: { productId, ...data },
          select: SELECT_BATCH,
        });
        await tx.product.update({
          where: { id: productId },
          data: { stock: { increment: data.stock } },
        });
        return batch;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new BatchError("DUPLICATE_LOT");
      }
      throw error;
    }
  },

  /**
   * Deletes a batch (scoped by product so an operator can't touch another
   * product's lot) and removes its units from Product.stock, floored at 0 —
   * orders decrement Product.stock without touching lots, so the product may
   * legitimately hold fewer units than the batch registered.
   */
  deleteWithStockRemoval: (id: string, productId: string): Promise<void> =>
    prisma.$transaction(async (tx) => {
      const batch = await tx.productBatch.findFirst({
        where: { id, productId },
        select: { id: true, stock: true },
      });
      if (!batch) return;

      await tx.productBatch.delete({ where: { id: batch.id } });

      const { count } = await tx.product.updateMany({
        where: { id: productId, stock: { gte: batch.stock } },
        data: { stock: { decrement: batch.stock } },
      });
      if (count === 0) {
        await tx.product.update({ where: { id: productId }, data: { stock: 0 } });
      }
    }),
};
