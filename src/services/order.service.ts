import { createOrderCode } from "@/lib/code";
import { strings } from "@/lib/strings";
import {
  type OrderDetailDto,
  OrderError,
  orderRepository,
} from "@/repositories/order.repo";
import { placeOrderSchema, type PlaceOrderInput } from "@/schemas/order.schema";

export type CreateOrderResult =
  | { ok: true; data: OrderDetailDto }
  | { ok: false; error: string };

/** Fetches a full order by its public code, or null if it doesn't exist. */
export async function getOrderByCode(code: string): Promise<OrderDetailDto | null> {
  return orderRepository.findByCode(code);
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
