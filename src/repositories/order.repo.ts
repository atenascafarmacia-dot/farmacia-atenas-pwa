import { Prisma } from "@/generated/prisma/client";
import {
  type DeliveryMethod,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export type { DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus };

/** Snapshot of the shipping address captured on the order at purchase time. */
export type ShippingSnapshot = {
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string | null;
};

export type OrderSummaryDto = {
  id: string;
  code: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  itemCount: number;
};

/** Compact row shown in the operator's order list. */
export type OrderListItemDto = {
  id: string;
  code: string;
  customerName: string;
  status: OrderStatus;
  total: number;
  itemsCount: number;
  createdAt: Date;
};

/** Filters shared by the list and count queries. */
export type OrderQueryFilters = {
  status?: OrderStatus;
  code?: string;
};

export type OrderListFilters = OrderQueryFilters & {
  skip: number;
  take: number;
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
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingZip: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: { id: string; name: string; email: string | null; phone: string };
  items: OrderItemDto[];
};

export type CreateOrderData = {
  code: string;
  userId: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  notes: string | null;
  /** Required for ENVIO_DOMICILIO; null for store pickup. */
  shipping: ShippingSnapshot | null;
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
  deliveryMethod: true,
  paymentMethod: true,
  paymentStatus: true,
  notes: true,
  shippingAddress: true,
  shippingCity: true,
  shippingState: true,
  shippingZip: true,
  createdAt: true,
  updatedAt: true,
  user: { select: { id: true, name: true, email: true, phone: true } },
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      product: { select: { id: true, name: true, imageUrl: true } },
    },
  },
} as const;

/** Builds the Prisma `where` shared by the operator list and count queries. */
function operatorWhere(filters: OrderQueryFilters): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (filters.status) where.status = filters.status;
  // Codes are stored/typed uppercase; SQLite LIKE is case-insensitive for ASCII.
  if (filters.code) where.code = { contains: filters.code };
  return where;
}

export const orderRepository = {
  /** Paginated order list for the operator, newest first. */
  findManyForOperator: async (filters: OrderListFilters): Promise<OrderListItemDto[]> => {
    const orders = await prisma.order.findMany({
      where: operatorWhere(filters),
      select: {
        id: true,
        code: true,
        status: true,
        total: true,
        createdAt: true,
        user: { select: { name: true } },
        _count: { select: { items: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: filters.skip,
      take: filters.take,
    });
    return orders.map((o) => ({
      id: o.id,
      code: o.code,
      customerName: o.user.name,
      status: o.status,
      total: o.total,
      itemsCount: o._count.items,
      createdAt: o.createdAt,
    }));
  },

  /** Total orders matching the filters (for pagination). */
  countOrders: (filters: OrderQueryFilters): Promise<number> =>
    prisma.order.count({ where: operatorWhere(filters) }),

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
  createWithItems: ({
    code,
    userId,
    deliveryMethod,
    paymentMethod,
    notes,
    shipping,
    items,
  }: CreateOrderData): Promise<OrderDetailDto> =>
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
        data: {
          code,
          userId,
          total,
          deliveryMethod,
          paymentMethod,
          notes,
          shippingAddress: shipping?.shippingAddress ?? null,
          shippingCity: shipping?.shippingCity ?? null,
          shippingState: shipping?.shippingState ?? null,
          shippingZip: shipping?.shippingZip ?? null,
          items: { create: orderItems },
        },
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

  updatePaymentStatus: (
    id: string,
    paymentStatus: PaymentStatus,
  ): Promise<{ id: string; paymentStatus: PaymentStatus }> =>
    prisma.order.update({
      where: { id },
      data: { paymentStatus },
      select: { id: true, paymentStatus: true },
    }),
};
