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
      /^(\+58|0)\d{10}$/,
      "Número inválido. Usa +58XXXXXXXXXX o 0XXXXXXXXXX (11 dígitos).",
    ),
});

export type UserIdentification = z.infer<typeof userIdentificationSchema>;
