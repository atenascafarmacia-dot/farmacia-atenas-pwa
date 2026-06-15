import { prisma } from "@/lib/prisma";

/** Ranks product IDs by total quantity sold, mapping a groupBy result. */
type RankedRow = { productId: string; _sum: { quantity: number | null } };

function toRankedIds(rows: RankedRow[]): string[] {
  return rows.map((row) => row.productId);
}

export const recommendationRepository = {
  /** Whether the user has ever ordered anything. */
  userHasHistory: async (userId: string): Promise<boolean> => {
    const count = await prisma.orderItem.count({ where: { order: { userId } } });
    return count > 0;
  },

  /** Product IDs the user buys most often, most-frequent first. */
  topProductIdsByUser: (userId: string, limit: number): Promise<string[]> =>
    prisma.orderItem
      .groupBy({
        by: ["productId"],
        where: { order: { userId } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: limit,
      })
      .then(toRankedIds),

  /** Best-selling product IDs across all orders, most-sold first. */
  topProductIdsGlobal: (limit: number): Promise<string[]> =>
    prisma.orderItem
      .groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: "desc" } },
        take: limit,
      })
      .then(toRankedIds),
};
