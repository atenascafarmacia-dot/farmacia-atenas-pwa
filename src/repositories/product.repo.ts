import { prisma } from "@/lib/prisma";

const SELECT_PRODUCT = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  imageUrl: true,
  category: true,
  requiresPrescription: true,
  createdAt: true,
} as const;

export type ProductDto = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: string;
  requiresPrescription: boolean;
  createdAt: Date;
};

export type ProductFilters = {
  category?: string;
  search?: string;
  requiresPrescription?: boolean;
};

export const productRepository = {
  findAll: (filters: ProductFilters = {}): Promise<ProductDto[]> =>
    prisma.product.findMany({
      where: {
        ...(filters.category && { category: filters.category }),
        ...(filters.requiresPrescription !== undefined && {
          requiresPrescription: filters.requiresPrescription,
        }),
        ...(filters.search && {
          OR: [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } },
          ],
        }),
      },
      select: SELECT_PRODUCT,
      orderBy: { name: "asc" },
    }),

  findById: (id: string): Promise<ProductDto | null> =>
    prisma.product.findUnique({ where: { id }, select: SELECT_PRODUCT }),

  findCategories: (): Promise<string[]> =>
    prisma.product
      .findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } })
      .then((rows) => rows.map((r) => r.category)),

  decrementStock: (id: string, quantity: number): Promise<void> =>
    prisma.product
      .update({ where: { id }, data: { stock: { decrement: quantity } } })
      .then(() => undefined),
};
