import { Prisma } from "@/generated/prisma/client";
import {
  type Currency,
  type DeliveryMethod,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { sellableWhere } from "@/repositories/product.repo";

export type { Currency, DeliveryMethod, OrderStatus, PaymentMethod, PaymentStatus };

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
  currency: Currency;
  exchangeRate: number | null;
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
  currency: Currency;
  exchangeRate: number | null;
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
  currency: Currency;
  notes: string | null;
  /** Required for ENVIO_DOMICILIO; null for store pickup. */
  shipping: ShippingSnapshot | null;
  items: Array<{ productId: string; quantity: number }>;
};

export type OrderErrorCode = "PRODUCT_NOT_FOUND" | "INSUFFICIENT_STOCK" | "RATE_UNAVAILABLE";

/** Domain error raised while placing an order; carries a code, not UI text. */
export class OrderError extends Error {
  constructor(
    readonly code: OrderErrorCode,
    readonly productId?: string,
    readonly productName?: string,
    readonly available?: number,
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
  currency: true,
  exchangeRate: true,
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
  // Postgres contains is case-sensitive by default; match codes regardless of case.
  if (filters.code) where.code = { contains: filters.code, mode: "insensitive" };
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
        currency: true,
        exchangeRate: true,
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
      currency: o.currency,
      exchangeRate: o.exchangeRate,
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
    currency,
    notes,
    shipping,
    items,
  }: CreateOrderData): Promise<OrderDetailDto> =>
    prisma.$transaction(async (tx) => {
      // The rate is read here — never from the client — so the snapshot is
      // authoritative, like the prices recomputed below.
      const setting = await tx.setting.findUnique({ where: { id: "main" } });
      const exchangeRate =
        currency === "VES"
          ? (setting?.usdVesRate ?? null)
          : currency === "COP"
            ? (setting?.usdCopRate ?? null)
            : null;
      if (currency !== "USD" && exchangeRate == null) {
        throw new OrderError("RATE_UNAVAILABLE");
      }
      // sellableWhere: inactive or expired products fall out and surface as
      // PRODUCT_NOT_FOUND ("ya no está disponible").
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i) => i.productId) }, ...sellableWhere() },
        select: { id: true, name: true, price: true, stock: true },
      });
      const productById = new Map(products.map((p) => [p.id, p]));

      const orderItems = items.map((item) => {
        const product = productById.get(item.productId);
        if (!product) throw new OrderError("PRODUCT_NOT_FOUND", item.productId);
        if (product.stock < item.quantity) {
          throw new OrderError("INSUFFICIENT_STOCK", item.productId, product.name, product.stock);
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
          currency,
          exchangeRate,
          notes,
          shippingAddress: shipping?.shippingAddress ?? null,
          shippingCity: shipping?.shippingCity ?? null,
          shippingState: shipping?.shippingState ?? null,
          shippingZip: shipping?.shippingZip ?? null,
          items: { create: orderItems },
        },
        select: SELECT_ORDER_DETAIL,
      });

      // Guarded decrement: under Read Committed the WHERE re-evaluates against
      // the committed row at write time, so concurrent checkouts can't drive
      // stock negative — the loser rolls back (order row included).
      for (const i of orderItems) {
        const { count } = await tx.product.updateMany({
          where: { id: i.productId, stock: { gte: i.quantity } },
          data: { stock: { decrement: i.quantity } },
        });
        if (count === 0) {
          const p = productById.get(i.productId);
          throw new OrderError("INSUFFICIENT_STOCK", i.productId, p?.name, p?.stock);
        }
      }

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
