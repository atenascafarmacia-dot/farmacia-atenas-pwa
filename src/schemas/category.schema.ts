import { z } from "zod";

/** Validates category create/update input (server-side source of truth). */
export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(60, "El nombre no puede superar los 60 caracteres."),
});

export type CategoryInput = z.infer<typeof categorySchema>;
