"use client";

import { Plus } from "lucide-react";

import { useCartStore } from "@/store/cart";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  outOfStock: boolean;
}

export function AddToCartButton({
  productId,
  name,
  price,
  imageUrl,
  outOfStock,
}: AddToCartButtonProps) {
  const add = useCartStore((s) => s.add);

  if (outOfStock) {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full border border-border px-3 py-2 text-sm font-medium text-muted">
        Sin stock
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add({ productId, name, price, imageUrl })}
      style={{ touchAction: "manipulation" }}
      className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary-600 px-3.5 py-2 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-primary-700 active:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      Agregar
    </button>
  );
}
