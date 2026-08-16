"use client";

import type { Currency } from "@/generated/prisma/enums";
import { strings } from "@/lib/strings";
import { rateFor, useCurrencyStore } from "@/store/currency";

const OPTIONS: Array<{ value: Currency; label: string; unavailableHint?: string }> = [
  { value: "USD", label: strings.currency.usd },
  { value: "VES", label: strings.currency.ves, unavailableHint: strings.currency.vesUnavailable },
  { value: "COP", label: strings.currency.cop, unavailableHint: strings.currency.copUnavailable },
];

/** Segmented $ / Bs / COP switch driving every store-driven price on screen. */
export function CurrencyToggle() {
  const currency = useCurrencyStore((s) => s.currency);
  const rates = useCurrencyStore((s) => s.rates);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  return (
    <div
      role="group"
      aria-label={strings.currency.toggleAria}
      className="inline-flex items-center rounded-full border border-border bg-surface p-0.5"
    >
      {OPTIONS.map((option) => {
        const isActive = currency === option.value;
        const isDisabled = option.value !== "USD" && rateFor(option.value, rates) == null;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setCurrency(option.value)}
            disabled={isDisabled}
            aria-pressed={isActive}
            title={isDisabled ? option.unavailableHint : undefined}
            className={`min-w-[32px] rounded-full px-2 py-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              isActive
                ? "bg-primary-600 text-white"
                : "text-muted hover:text-ink disabled:opacity-40"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
