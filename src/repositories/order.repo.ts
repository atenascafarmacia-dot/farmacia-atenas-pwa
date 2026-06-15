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
  total: number;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
};

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

  create: ({ code, userId, total, items }: CreateOrderData): Promise<OrderDetailDto> =>
    prisma.order.create({
      data: {
        code,
        userId,
        total,
        items: { create: items },
      },
      select: SELECT_ORDER_DETAIL,
    }),

  updateStatus: (id: string, status: OrderStatus): Promise<{ id: string; status: OrderStatus }> =>
    prisma.order.update({ where: { id }, data: { status }, select: { id: true, status: true } }),
};
