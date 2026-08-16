import type { Currency } from "@/generated/prisma/enums";

/**
 * Money helpers. All stored amounts (Product.price, Order.total,
 * OrderItem.unitPrice) are USD; bolívar/peso amounts are derived at display
 * time from a per-USD rate and rounded only here, at the formatting boundary.
 */

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: "$",
  VES: "Bs",
  COP: "COP",
};

// style: "currency" is avoided on purpose: ICU output for VES/COP is
// inconsistent across runtimes. Literal prefixes are stable.
const vesFormatter = new Intl.NumberFormat("es-VE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const copFormatter = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function convertUsd(amountUsd: number, rate: number): number {
  return amountUsd * rate;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatVes(amountVes: number): string {
  return `Bs ${vesFormatter.format(amountVes)}`;
}

export function formatCop(amountCop: number): string {
  return `COP ${copFormatter.format(amountCop)}`;
}

/** Rate as a bare es-VE number, e.g. "168,50". */
export function formatRate(rate: number): string {
  return vesFormatter.format(rate);
}

/** A non-USD currency with a null rate falls back to USD (legacy/unconfigured). */
export function formatMoney(amountUsd: number, currency: Currency, rate: number | null): string {
  if (rate != null) {
    if (currency === "VES") return formatVes(convertUsd(amountUsd, rate));
    if (currency === "COP") return formatCop(convertUsd(amountUsd, rate));
  }
  return formatUsd(amountUsd);
}
