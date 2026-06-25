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

export const batchRepository = {
  findByProduct: (productId: string): Promise<ProductBatchDto[]> =>
    prisma.productBatch.findMany({
      where: { productId },
      select: SELECT_BATCH,
      orderBy: { expiresAt: "asc" },
    }),

  create: (productId: string, data: BatchWriteData): Promise<ProductBatchDto> =>
    prisma.productBatch.create({ data: { productId, ...data }, select: SELECT_BATCH }),

  /** Deletes a batch, scoped by product so an operator can't touch another product's lot. */
  delete: (id: string, productId: string): Promise<void> =>
    prisma.productBatch
      .deleteMany({ where: { id, productId } })
      .then(() => undefined),
};
