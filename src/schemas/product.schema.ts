import { z } from "zod";

import { todayCalendarDate } from "@/lib/date";

/**
 * Builds the product create/update schema (server-side source of truth).
 *
 * `allowExpirationDate` lets an edit keep an already-stored past date (so a
 * product whose date expired can still have its price/description fixed), but
 * a *new* past date is always rejected.
 */
export function buildProductSchema(options?: { allowExpirationDate?: Date | null }) {
  const allowed = options?.allowExpirationDate ?? null;
  return z.object({
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
    price: z.preprocess(
      // Mobile keyboards produce comma decimals ("4,20"); normalize before coercing.
      (v) => (typeof v === "string" ? v.trim().replace(",", ".") : v),
      z.coerce
        .number({ message: "El precio es obligatorio." })
        .positive("El precio debe ser mayor que 0."),
    ),
    stock: z.coerce
      .number({ message: "El stock es obligatorio." })
      .int("El stock debe ser un número entero.")
      .min(0, "El stock no puede ser negativo."),
    categoryId: z.cuid("Selecciona una categoría válida."),
    expirationDate: z.preprocess(
      (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
      z.coerce
        .date("Fecha de vencimiento inválida.")
        .optional()
        .refine(
          (d) => d === undefined || d >= todayCalendarDate() || d.getTime() === allowed?.getTime(),
          "La fecha de vencimiento no puede estar en el pasado.",
        ),
    ),
    imageUrl: z.url("La URL de la imagen no es válida.").optional().or(z.literal("")),
    requiresPrescription: z.boolean(),
  });
}

export const productSchema = buildProductSchema();

export type ProductInput = z.infer<typeof productSchema>;
