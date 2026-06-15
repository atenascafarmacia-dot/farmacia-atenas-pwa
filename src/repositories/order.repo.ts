import { type OrderStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type { OrderStatus };

export type OrderSummaryDto = {
  id: string;
  code: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  itemCount: number;
};

export type OrderItemDto = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string; imageUrl: string | null };
};

export type OrderDetailDto = {
  id: string;
  code: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; name: string; email: string | null };
  items: OrderItemDto[];
};

export type CreateOrderData = {
  code: string;
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
};

export type OrderErrorCode = "PRODUCT_NOT_FOUND" | "INSUFFICIENT_STOCK";

/** Domain error raised while placing an order; carries a code, not UI text. */
export class OrderError extends Error {
  constructor(
    readonly code: OrderErrorCode,
    readonly productId?: string,
  ) {
    super(code);
    this.name = "OrderError";
  }
}

const SELECT_ORDER_DETAIL = {
  id: true,
  code: true,
  status: true,
  total: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true } },
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      product: { select: { id: true, name: true, imageUrl: true } },
    },
  },
} as const;

export const orderRepository = {
  findByUserId: async (userId: string): Promise<OrderSummaryDto[]> => {
    const orders = await prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        code: true,
        status: true,
        total: true,
        createdAt: true,
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return orders.map((o) => ({ ...o, itemCount: o._count.items }));
  },

  findByCode: (code: string): Promise<OrderDetailDto | null> =>
    prisma.order.findUnique({ where: { code }, select: SELECT_ORDER_DETAIL }),

  findById: (id: string): Promise<OrderDetailDto | null> =>
    prisma.order.findUnique({ where: { id }, select: SELECT_ORDER_DETAIL }),

  /**
   * Atomically creates an Order with its items. Prices and the total are
   * recomputed from the DB inside the transaction (never trusting the client),
   * stock is validated and decremented in the same atomic unit.
   */
  createWithItems: ({ code, userId, items }: CreateOrderData): Promise<OrderDetailDto> =>
    prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
        select: { id: true, price: true, stock: true },
      });
      const productById = new Map(products.map((p) => [p.id, p]));

      const orderItems = items.map((item) => {
        const product = productById.get(item.productId);
        if (!product) throw new OrderError("PRODUCT_NOT_FOUND", item.productId);
        if (product.stock < item.quantity) {
          throw new OrderError("INSUFFICIENT_STOCK", item.productId);
        }
        return { productId: item.productId, quantity: item.quantity, unitPrice: product.price };
      });

      const total = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

      const order = await tx.order.create({
        data: { code, userId, total, items: { create: orderItems } },
        select: SELECT_ORDER_DETAIL,
      });

      await Promise.all(
        orderItems.map((i) =>
          tx.product.update({
            where: { id: i.productId },
            data: { stock: { decrement: i.quantity } },
          }),
        ),
      );

      return order;
    }),

  updateStatus: (id: string, status: OrderStatus): Promise<{ id: string; status: OrderStatus }> =>
    prisma.order.update({ where: { id }, data: { status }, select: { id: true, status: true } }),
};
