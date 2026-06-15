"use client";

import { useEffect } from "react";

import { type CartEntry,useCartStore } from "@/store/cart";

const STORAGE_KEY = "pharmacy-cart";

function readStorage(): CartEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "items" in parsed &&
      Array.isArray((parsed as { items: unknown }).items)
    ) {
      return (parsed as { items: CartEntry[] }).items;
    }
  } catch {
    // Ignore corrupt data or unavailable storage
  }
  return [];
}

function writeStorage(items: CartEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  } catch {
    // Ignore unavailable storage (private mode, quota exceeded, etc.)
  }
}

export function StoreHydrator() {
  // Load persisted cart on first mount
  useEffect(() => {
    const saved = readStorage();
    if (saved.length > 0) {
      useCartStore.setState({ items: saved });
    }
  }, []);

  // Persist every cart change to localStorage
  useEffect(() => {
    const unsubscribe = useCartStore.subscribe((state) => {
      writeStorage(state.items);
    });
    return unsubscribe;
  }, []);

  return null;
}
