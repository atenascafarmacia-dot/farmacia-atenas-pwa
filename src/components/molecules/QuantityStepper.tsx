"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantityStepperProps) {
  const stepClass =
    "flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-40";

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-card shadow-soft"
      role="group"
      aria-label="Cantidad"
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Reducir cantidad"
        className={stepClass}
      >
        <Minus size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>
      <span
        className="w-9 text-center text-base font-bold tabular-nums text-ink"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Aumentar cantidad"
        className={stepClass}
      >
        <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
