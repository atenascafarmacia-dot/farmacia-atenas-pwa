import { z } from "zod";

/** Validates product create/update input (server-side source of truth). */
export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(120, "El nombre no puede superar los 120 caracteres."),
  description: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres.")
    .optional()
    .or(z.literal("")),
  price: z.coerce
    .number({ message: "El precio es obligatorio." })
    .positive("El precio debe ser mayor que 0."),
  stock: z.coerce
    .number({ message: "El stock es obligatorio." })
    .int("El stock debe ser un número entero.")
    .min(0, "El stock no puede ser negativo."),
  categoryId: z.cuid("Selecciona una categoría válida."),
  expirationDate: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.date("Fecha de vencimiento inválida.").optional(),
  ),
  imageUrl: z
    .url("La URL de la imagen no es válida.")
    .optional()
    .or(z.literal("")),
  requiresPrescription: z.boolean(),
});

export type ProductInput = z.infer<typeof productSchema>;
