import { z } from "zod";

/** Validates address create/update input (server-side source of truth). */
export const addressSchema = z.object({
  label: z
    .string()
    .trim()
    .max(40, "La etiqueta no puede superar los 40 caracteres.")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(5, "La dirección debe tener al menos 5 caracteres.")
    .max(200, "La dirección no puede superar los 200 caracteres."),
  city: z
    .string()
    .trim()
    .min(2, "La ciudad debe tener al menos 2 caracteres.")
    .max(80, "La ciudad no puede superar los 80 caracteres."),
  state: z
    .string()
    .trim()
    .min(2, "El estado debe tener al menos 2 caracteres.")
    .max(80, "El estado no puede superar los 80 caracteres."),
  zipCode: z
    .string()
    .trim()
    .max(20, "El código postal no puede superar los 20 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type AddressInput = z.infer<typeof addressSchema>;
