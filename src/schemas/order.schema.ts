import { z } from "zod";

import { OrderStatus } from "@/generated/prisma/enums";
import { cartItemSchema } from "@/schemas/cart.schema";
import { userIdentificationSchema } from "@/schemas/user.schema";

export const createOrderSchema = z.object({
  user: userIdentificationSchema,
  items: z
    .array(cartItemSchema)
    .min(1, "El pedido debe tener al menos un producto.")
    .max(50, "El pedido no puede contener más de 50 productos distintos."),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/** Server-side input for placing an order from an identified session. */
export const placeOrderSchema = z.object({
  userId: z.cuid("Usuario inválido."),
  items: z
    .array(cartItemSchema)
    .min(1, "El pedido debe tener al menos un producto.")
    .max(50, "El pedido no puede contener más de 50 productos distintos."),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

/**
 * Filters for the operator's order list, parsed straight from `searchParams`.
 * Per-field `.catch()` keeps a single bad query param from breaking the page.
 */
export const orderListFilterSchema = z.object({
  status: z.enum(OrderStatus).optional().catch(undefined),
  q: z.string().trim().min(1).max(20).optional().catch(undefined),
  page: z.coerce.number().int().min(1).catch(1).default(1),
});

export type OrderListFilter = z.infer<typeof orderListFilterSchema>;

/** Server Action input for moving an order between statuses. */
export const updateOrderStatusSchema = z.object({
  orderId: z.cuid("Pedido inválido."),
  code: z.string().min(1),
  status: z.enum(OrderStatus),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
