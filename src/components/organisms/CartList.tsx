"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createOrderAction } from "@/app/_actions/order.action";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Price } from "@/components/atoms/Price";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { EmptyState } from "@/components/molecules/EmptyState";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { strings } from "@/lib/strings";
import { selectCartTotal, useCartStore } from "@/store/cart";

export function CartList() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const clear = useCartStore((s) => s.clear);
  const total = useCartStore(selectCartTotal);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    setError(null);
    const payload = items.map((i) => ({ productId: i.productId, quantity: i.quantity }));
    startTransition(async () => {
      const result = await createOrderAction(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      clear();
      router.push(`/pedido/${result.code}`);
    });
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingCart className="h-7 w-7" strokeWidth={1.5} />}
        title={strings.cart.empty}
        message={strings.cart.emptyHint}
        action={
          <Link href="/catalogo">
            <Button variant="outline">{strings.cart.goCatalog}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col divide-y divide-zinc-100" aria-label="Productos en el carrito">
        {items.map((item) => (
          <li key={item.productId} className="flex items-start gap-3 py-4">
            <ProductThumb
              imageUrl={item.imageUrl}
              name={item.name}
              className="h-16 w-16 flex-shrink-0"
              iconClassName="h-7 w-7"
            />

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
        {error && (
          <p role="alert" className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button
          className="w-full"
          size="lg"
          loading={isPending}
          onClick={handleCheckout}
        >
          {strings.cart.checkout}
        </Button>
      </div>
    </div>
  );
}
