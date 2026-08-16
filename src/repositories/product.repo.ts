import { todayCalendarDate } from "@/lib/date";
import { prisma } from "@/lib/prisma";

/**
 * Customer-facing availability: active and not past its expiration date.
 * Management queries intentionally skip this so expired products stay editable.
 */
export function sellableWhere() {
  return {
    isActive: true,
    OR: [{ expirationDate: null }, { expirationDate: { gte: todayCalendarDate() } }],
  };
}

const SELECT_PRODUCT = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  imageUrl: true,
  category: { select: { id: true, name: true } },
  expirationDate: true,
  requiresPrescription: true,
  isActive: true,
  createdAt: true,
} as const;

export type ProductDto = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: { id: string; name: string };
  expirationDate: Date | null;
  requiresPrescription: boolean;
  isActive: boolean;
  createdAt: Date;
};

/** Writable product fields (create / update). */
export type ProductWriteData = {
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  categoryId: string;
  expirationDate: Date | null;
  requiresPrescription: boolean;
};

export type ProductFilters = {
  categoryId?: string;
  search?: string;
  requiresPrescription?: boolean;
};

export const productRepository = {
  // ---- Public reads: active products only ----

  findAll: (filters: ProductFilters = {}): Promise<ProductDto[]> =>
    prisma.product.findMany({
      where: {
        // sellableWhere carries its own OR, so it lives under AND to keep it
        // independent from the search OR below.
        AND: [sellableWhere()],
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.requiresPrescription !== undefined && {
          requiresPrescription: filters.requiresPrescription,
        }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { description: { contains: filters.search, mode: "insensitive" as const } },
          ],
        }),
      },
      select: SELECT_PRODUCT,
      orderBy: { name: "asc" },
    }),

  findById: (id: string): Promise<ProductDto | null> =>
    prisma.product.findFirst({ where: { id, ...sellableWhere() }, select: SELECT_PRODUCT }),

  /** Fetches sellable products by IDs, preserving the given order (e.g. a ranking). */
  findByIds: async (ids: string[]): Promise<ProductDto[]> => {
    if (ids.length === 0) return [];
    const products = await prisma.product.findMany({
      where: { id: { in: ids }, ...sellableWhere() },
      select: SELECT_PRODUCT,
    });
    const byId = new Map(products.map((p) => [p.id, p]));
    return ids.map((id) => byId.get(id)).filter((p): p is ProductDto => p !== undefined);
  },

  /** Lightweight id → stock read used to check cart availability. */
  findStockLevels: (): Promise<Array<{ id: string; stock: number }>> =>
    prisma.product.findMany({
      where: sellableWhere(),
      select: { id: true, stock: true },
    }),

  decrementStock: (id: string, quantity: number): Promise<void> =>
    prisma.product
      .update({ where: { id }, data: { stock: { decrement: quantity } } })
      .then(() => undefined),

  // ---- Management reads: include inactive products ----

  findAllForManagement: (): Promise<ProductDto[]> =>
    prisma.product.findMany({
      select: SELECT_PRODUCT,
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
    }),

  findByIdForManagement: (id: string): Promise<ProductDto | null> =>
    prisma.product.findUnique({ where: { id }, select: SELECT_PRODUCT }),

  countOrderItems: (id: string): Promise<number> =>
    prisma.orderItem.count({ where: { productId: id } }),

  // ---- Writes ----

  create: (data: ProductWriteData): Promise<ProductDto> =>
    prisma.product.create({ data, select: SELECT_PRODUCT }),

  update: (id: string, data: ProductWriteData): Promise<ProductDto> =>
    prisma.product.update({ where: { id }, data, select: SELECT_PRODUCT }),

  /** Soft delete: keep the row (and its order history) but hide it. */
  softDelete: (id: string): Promise<ProductDto> =>
    prisma.product.update({
      where: { id },
      data: { isActive: false },
      select: SELECT_PRODUCT,
    }),

  /** Hard delete: only safe when the product is referenced by no order. */
  hardDelete: (id: string): Promise<void> =>
    prisma.product.delete({ where: { id } }).then(() => undefined),
};
