"use client";

import type { Currency } from "@/generated/prisma/enums";
import { formatMoney } from "@/lib/money";
import { rateFor, useCurrencyStore } from "@/store/currency";

interface PriceProps {
  /** Amount in USD — the base currency for every stored price. */
  amount: number;
  /**
   * Fix the display currency (order snapshots, USD-only admin views).
   * Omit to follow the customer's global $/Bs toggle.
   */
  currency?: Currency;
  /** Snapshot Bs-per-USD rate for a forced VES render; null falls back to USD. */
  rate?: number | null;
  className?: string;
}

export function Price({ amount, currency, rate, className = "" }: PriceProps) {
  const storeCurrency = useCurrencyStore((s) => s.currency);
  const storeRates = useCurrencyStore((s) => s.rates);

  const effCurrency = currency ?? storeCurrency;
  const effRate = currency !== undefined ? (rate ?? null) : rateFor(storeCurrency, storeRates);

  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {formatMoney(amount, effCurrency, effRate)}
    </span>
  );
}
