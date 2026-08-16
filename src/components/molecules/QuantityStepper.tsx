"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";

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
  // Draft mirrors `value` but lets the user clear/type freely; it commits
  // (clamped to [min, max]) on blur or Enter. Resync during render when the
  // controlled value changes externally (React's adjust-state-on-prop pattern).
  const [draft, setDraft] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setDraft(String(value));
  }

  function commit() {
    const parsed = Number.parseInt(draft, 10);
    if (Number.isNaN(parsed)) {
      setDraft(String(value));
      return;
    }
    const clamped = Math.min(max, Math.max(min, parsed));
    setDraft(String(clamped));
    if (clamped !== value) onChange(clamped);
  }

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
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        disabled={disabled}
        aria-label="Cantidad"
        className="w-10 bg-transparent text-center text-base font-bold tabular-nums text-ink focus:outline-none disabled:opacity-40"
      />
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
