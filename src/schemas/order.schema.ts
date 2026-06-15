import { z } from "zod";

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
