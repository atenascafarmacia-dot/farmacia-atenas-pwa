import { z } from "zod";

const optionalRate = (requiredMessage: string) =>
  z.preprocess(
    (v) => {
      if (typeof v !== "string") return v;
      const trimmed = v.trim();
      if (trimmed === "") return undefined;
      // Mobile keyboards produce comma decimals ("772,56"); normalize.
      return trimmed.replace(",", ".");
    },
    z.coerce
      .number({ message: requiredMessage })
      .positive("La tasa debe ser mayor que cero.")
      .max(1_000_000, "La tasa no puede superar 1.000.000.")
      .optional(),
  );

/** Validates the per-USD exchange rates; an empty field disables that currency. */
export const exchangeRateSchema = z.object({
  vesRate: optionalRate("Ingresa una tasa válida."),
  copRate: optionalRate("Ingresa una tasa válida."),
});

export type ExchangeRateInput = z.infer<typeof exchangeRateSchema>;
