import { prisma } from "@/lib/prisma";

const SELECT_CATEGORY = {
  id: true,
  name: true,
} as const;

export type CategoryDto = {
  id: string;
  name: string;
};

export type CategoryWithCountDto = CategoryDto & { productCount: number };

export const categoryRepository = {
  findAll: (): Promise<CategoryDto[]> =>
    prisma.category.findMany({ select: SELECT_CATEGORY, orderBy: { name: "asc" } }),

  /** Categories with how many products each groups (for the management list). */
  findAllWithCounts: async (): Promise<CategoryWithCountDto[]> => {
    const rows = await prisma.category.findMany({
      select: { ...SELECT_CATEGORY, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
    return rows.map(({ _count, ...rest }) => ({ ...rest, productCount: _count.products }));
  },

  findById: (id: string): Promise<CategoryDto | null> =>
    prisma.category.findUnique({ where: { id }, select: SELECT_CATEGORY }),

  countProducts: (id: string): Promise<number> =>
    prisma.product.count({ where: { categoryId: id } }),

  create: (name: string): Promise<CategoryDto> =>
    prisma.category.create({ data: { name }, select: SELECT_CATEGORY }),

  update: (id: string, name: string): Promise<CategoryDto> =>
    prisma.category.update({ where: { id }, data: { name }, select: SELECT_CATEGORY }),

  delete: (id: string): Promise<void> =>
    prisma.category.delete({ where: { id } }).then(() => undefined),
};
