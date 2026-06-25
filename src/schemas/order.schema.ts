import { z } from "zod";

import { DeliveryMethod, OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
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

const orderItemsSchema = z
  .array(cartItemSchema)
  .min(1, "El pedido debe tener al menos un producto.")
  .max(50, "El pedido no puede contener más de 50 productos distintos.");

const optionalText = z.string().trim().optional().or(z.literal(""));

/**
 * Server-side input for placing an order from an identified session. Shipping
 * fields are required only for home delivery; the refinement enforces that and
 * targets the offending field so the form can surface it.
 */
export const placeOrderSchema = z
  .object({
    userId: z.cuid("Usuario inválido."),
    items: orderItemsSchema,
    deliveryMethod: z.enum(DeliveryMethod, { message: "Método de entrega inválido." }),
    paymentMethod: z.enum(PaymentMethod, { message: "Método de pago inválido." }),
    notes: z.string().trim().max(500, "Las notas no pueden superar los 500 caracteres.").optional().or(z.literal("")),
    shippingAddress: optionalText,
    shippingCity: optionalText,
    shippingState: optionalText,
    shippingZip: optionalText,
    /** When true (and a new address was typed), persist it to the address book. */
    saveAddress: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod !== "ENVIO_DOMICILIO") return;
    const required: Array<["shippingAddress" | "shippingCity" | "shippingState", string]> = [
      ["shippingAddress", "La dirección es obligatoria para envío a domicilio."],
      ["shippingCity", "La ciudad es obligatoria para envío a domicilio."],
      ["shippingState", "El estado es obligatorio para envío a domicilio."],
    ];
    for (const [field, message] of required) {
      if (!data[field] || data[field]!.trim().length < 2) {
        ctx.addIssue({ code: "custom", path: [field], message });
      }
    }
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
