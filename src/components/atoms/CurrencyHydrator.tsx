"use client";

import { useEffect } from "react";

import { type ExchangeRates, rateFor, useCurrencyStore } from "@/store/currency";

const STORAGE_KEY = "pharmacy-currency";

function readStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    // Ignore unavailable storage (private mode, etc.)
    return null;
  }
}

function writeStorage(currency: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, currency);
  } catch {
    // Ignore unavailable storage
  }
}

interface CurrencyHydratorProps {
  /** Server-provided per-USD rates for this request. */
  rates: ExchangeRates;
}

export function CurrencyHydrator({ rates }: CurrencyHydratorProps) {
  // Push the fresh server rates into the store (re-runs when they change).
  // Compared by value: the prop object is recreated on every server render.
  useEffect(() => {
    const current = useCurrencyStore.getState().rates;
    if (current.ves !== rates.ves || current.cop !== rates.cop) {
      useCurrencyStore.getState().setRates({ ves: rates.ves, cop: rates.cop });
    }
  }, [rates.ves, rates.cop]);

  // Load the persisted preference on first mount; only if its rate exists.
  useEffect(() => {
    const saved = readStorage();
    if (
      (saved === "VES" || saved === "COP") &&
      rateFor(saved, useCurrencyStore.getState().rates) != null
    ) {
      useCurrencyStore.setState({ currency: saved });
    }
  }, []);

  // Persist every currency change.
  useEffect(() => {
    const unsubscribe = useCurrencyStore.subscribe((state) => {
      writeStorage(state.currency);
    });
    return unsubscribe;
  }, []);

  return null;
}
