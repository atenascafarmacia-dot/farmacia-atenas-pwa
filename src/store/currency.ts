import { create } from "zustand";

import type { Currency } from "@/generated/prisma/enums";

export type ExchangeRates = {
  /** Bs per USD; null = unconfigured (currency disabled). */
  ves: number | null;
  /** COP per USD; null = unconfigured (currency disabled). */
  cop: number | null;
};

type CurrencyState = {
  /** Display/payment currency chosen by the customer. */
  currency: Currency;
  /** Per-USD rates provided by the server on every request. */
  rates: ExchangeRates;
  setCurrency: (currency: Currency) => void;
  setRates: (rates: ExchangeRates) => void;
};

export function rateFor(currency: Currency, rates: ExchangeRates): number | null {
  if (currency === "VES") return rates.ves;
  if (currency === "COP") return rates.cop;
  return null;
}

export const useCurrencyStore = create<CurrencyState>()((set) => ({
  currency: "USD",
  rates: { ves: null, cop: null },

  setCurrency: (currency) => set({ currency }),

  // Losing the active currency's rate forces the display back to USD.
  setRates: (rates) =>
    set((state) => ({
      rates,
      currency:
        state.currency !== "USD" && rateFor(state.currency, rates) == null ? "USD" : state.currency,
    })),
}));
