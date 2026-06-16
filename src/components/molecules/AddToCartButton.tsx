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
      <span className="inline-flex h-9 shrink-0 items-center rounded-full border border-border px-3 text-sm font-medium text-muted">
        Sin stock
      </span>
    );
  }

  // Tonal (soft) style so the repeated catalog action doesn't saturate the grid;
  // the solid primary fill is reserved for the main screen CTAs.
  return (
    <button
      type="button"
      onClick={() => add({ productId, name, price, imageUrl })}
      style={{ touchAction: "manipulation" }}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-primary-100 bg-primary-50 px-3.5 text-sm font-medium text-primary-700 transition hover:bg-primary-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
    >
      <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
      Agregar
    </button>
  );
}
