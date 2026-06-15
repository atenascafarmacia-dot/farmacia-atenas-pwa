import { z } from "zod";

export const userIdentificationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede exceder 100 caracteres."),
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[\d\s\-().]{7,20}$/,
      "Número de teléfono inválido. Ejemplo: +58 1234567891",
    ),
});

export type UserIdentification = z.infer<typeof userIdentificationSchema>;
