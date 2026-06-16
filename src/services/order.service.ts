import { createOrderCode } from "@/lib/code";
import { strings } from "@/lib/strings";
import {
  type OrderDetailDto,
  OrderError,
  type OrderListItemDto,
  orderRepository,
  type OrderStatus,
} from "@/repositories/order.repo";
import {
  type OrderListFilter,
  orderListFilterSchema,
  type PlaceOrderInput,
  placeOrderSchema,
} from "@/schemas/order.schema";

export type CreateOrderResult =
  | { ok: true; data: OrderDetailDto }
  | { ok: false; error: string };

/** Orders per page in the operator list. */
const PAGE_SIZE = 10;

export type OrderListResult = {
  items: OrderListItemDto[];
  total: number;
  page: number;
  pageSize: number;
};

/** Fetches a full order by its public code, or null if it doesn't exist. */
export async function getOrderByCode(code: string): Promise<OrderDetailDto | null> {
  return orderRepository.findByCode(code);
}

/** Operator order detail by code (alias kept explicit for the orders views). */
export async function getOrderDetail(code: string): Promise<OrderDetailDto | null> {
  return orderRepository.findByCode(code.trim());
}

/**
 * Validated, paginated order list for the operator. Raw `searchParams` are
 * sanitized by the schema (bad params fall back to defaults).
 */
export async function listOrders(raw: unknown): Promise<OrderListResult> {
  const filters: OrderListFilter = orderListFilterSchema.parse(raw);
  const code = filters.q?.toUpperCase();
  const queryFilters = { status: filters.status, code };

  const [items, total] = await Promise.all([
    orderRepository.findManyForOperator({
      ...queryFilters,
      skip: (filters.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    orderRepository.countOrders(queryFilters),
  ]);

  return { items, total, page: filters.page, pageSize: PAGE_SIZE };
}

/** Marks an order as completed (picked up at the counter). */
export async function completeOrder(orderId: string): Promise<void> {
  await orderRepository.updateStatus(orderId, "COMPLETADA");
}

/** Moves an order to an arbitrary status (operator action). */
export async function setOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  await orderRepository.updateStatus(orderId, status);
}

/** Maps a domain error to a user-facing Spanish message. */
function messageFor(error: unknown): string {
  if (error instanceof OrderError) {
    switch (error.code) {
      case "PRODUCT_NOT_FOUND":
        return strings.orders.create.productUnavailable;
      case "INSUFFICIENT_STOCK":
        return strings.orders.create.insufficientStock;
    }
  }
  return strings.orders.create.failed;
}

/**
 * Validates the request, generates the order code (factory) and persists the
 * Order + OrderItems atomically. The total is always recomputed server-side
 * inside the repository transaction from DB prices.
 */
export async function createOrder(input: PlaceOrderInput): Promise<CreateOrderResult> {
  const parsed = placeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? strings.orders.create.invalid,
    };
  }

  try {
    const order = await orderRepository.createWithItems({
      code: createOrderCode(),
      userId: parsed.data.userId,
      items: parsed.data.items,
    });
    return { ok: true, data: order };
  } catch (error) {
    return { ok: false, error: messageFor(error) };
  }
}
