"use client";

import Link from "next/link";

import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Price } from "@/components/atoms/Price";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { strings } from "@/lib/strings";
import { selectCartTotal, useCartStore } from "@/store/cart";

export function CartList() {
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const total = useCartStore(selectCartTotal);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <span aria-hidden="true" className="text-6xl">🛒</span>
        <div>
          <p className="text-lg font-semibold text-zinc-800">{strings.cart.empty}</p>
          <p className="mt-1 text-sm text-zinc-500">Agrega productos desde el catálogo.</p>
        </div>
        <Link href="/catalogo">
          <Button variant="outline">Ver catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-zinc-100" aria-label="Productos en el carrito">
        {items.map((item) => (
          <li key={item.productId} className="flex items-start gap-3 py-4">
            <div
              className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100"
              aria-hidden="true"
            >
              <span className="text-2xl">💊</span>
            </div>

            <div className="flex flex-1 flex-col gap-2 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium leading-tight text-zinc-900 line-clamp-2">
                  {item.name}
                </p>
                <button
                  onClick={() => remove(item.productId)}
                  aria-label={`Eliminar ${item.name} del carrito`}
                  className="flex-shrink-0 rounded-lg p-1 text-zinc-400 transition-colors hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(qty) => setQuantity(item.productId, qty)}
                  min={1}
                  max={99}
                />
                <Price
                  amount={item.price * item.quantity}
                  className="text-base text-green-700"
                />
              </div>

              {item.quantity > 1 && (
                <p className="text-xs text-zinc-400">
                  <Price amount={item.price} /> c/u
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 -mx-4 border-t border-zinc-100 bg-white px-4 pb-4 pt-3">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-base font-semibold text-zinc-900">{strings.cart.total}</span>
          <Price amount={total} className="text-xl text-green-700" />
        </div>
        <Button className="w-full" size="lg">
          {strings.cart.checkout}
        </Button>
      </div>
    </div>
  );
}
