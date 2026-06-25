import { z } from "zod";

/** Validates a product batch (lot) create input. */
export const batchSchema = z.object({
  lotNumber: z
    .string()
    .trim()
    .min(1, "El número de lote es obligatorio.")
    .max(60, "El número de lote no puede superar los 60 caracteres."),
  expiresAt: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
    z.coerce.date("Fecha de vencimiento inválida.").optional(),
  ),
  stock: z.coerce
    .number({ message: "El stock del lote es obligatorio." })
    .int("El stock debe ser un número entero.")
    .min(0, "El stock no puede ser negativo."),
});

export type BatchInput = z.infer<typeof batchSchema>;
