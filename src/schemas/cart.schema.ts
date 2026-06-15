import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.cuid("ID de producto inválido."),
  quantity: z
    .int()
    .min(1, "La cantidad mínima es 1.")
    .max(99, "La cantidad máxima es 99 unidades."),
});

export const cartSchema = z
  .array(cartItemSchema)
  .min(1, "El carrito no puede estar vacío.");

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = z.infer<typeof cartSchema>;
