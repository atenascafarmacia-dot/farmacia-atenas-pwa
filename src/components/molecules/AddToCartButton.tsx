"use client";

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
  const inCart = useCartStore((s) => s.items.some((i) => i.productId === productId));

  if (outOfStock) {
    return (
      <span className="shrink-0 rounded-xl border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-400">
        Sin stock
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => add({ productId, name, price, imageUrl })}
      style={{ touchAction: "manipulation" }}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
        inCart
          ? "border border-green-600 text-green-600"
          : "bg-green-600 text-white active:bg-green-700"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        width={14}
        height={14}
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Agregar
    </button>
  );
}
