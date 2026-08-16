"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Price } from "@/components/atoms/Price";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { EmptyState } from "@/components/molecules/EmptyState";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { strings } from "@/lib/strings";
import { selectCartTotal, useCartStore } from "@/store/cart";

interface CartListProps {
  /** Live stock per active product id; a missing id means the product is gone. */
  stockById: Record<string, number>;
}

export function CartList({ stockById }: CartListProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const remove = useCartStore((s) => s.remove);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const total = useCartStore(selectCartTotal);

  const hasStockIssues = items.some((item) => item.quantity > (stockById[item.productId] ?? 0));

  function handleCheckout() {
    router.push("/checkout");
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
    <div className="flex flex-col gap-3">
      <ul className="flex flex-col divide-y divide-border" aria-label="Productos en el carrito">
        {items.map((item) => {
          const available = stockById[item.productId] ?? 0;
          const outOfStock = available === 0;
          const exceedsStock = !outOfStock && item.quantity > available;

          return (
            <li key={item.productId} className="flex items-start gap-3 py-3">
              <ProductThumb
                imageUrl={item.imageUrl}
                name={item.name}
                className="h-16 w-16 flex-shrink-0"
                iconClassName="h-7 w-7"
              />

              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-semibold leading-tight text-ink">
                    {item.name}
                  </p>
                  <button
                    onClick={() => remove(item.productId)}
                    aria-label={`Eliminar ${item.name} del carrito`}
                    className="flex-shrink-0 rounded-lg p-1 text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                  >
                    <Icon name="x" size={16} />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {outOfStock ? (
                    <Badge variant="danger">{strings.products.outOfStock}</Badge>
                  ) : exceedsStock ? (
                    <Badge variant="warning">{strings.cart.onlyLeft(available)}</Badge>
                  ) : (
                    <span className="text-xs text-muted">
                      {strings.products.availableCount(available)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(qty) => setQuantity(item.productId, qty)}
                    min={1}
                    max={Math.min(99, Math.max(1, available))}
                    disabled={outOfStock}
                  />
                  <Price
                    amount={item.price * item.quantity}
                    className="text-base font-bold text-primary-700"
                  />
                </div>

                {item.quantity > 1 && (
                  <p className="text-xs text-muted">
                    <Price amount={item.price} /> c/u
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-[56px] -mx-4 border-t border-border bg-card px-4 pb-4 pt-3">
        <div className="mb-3 flex items-center justify-between rounded-xl bg-primary-50 px-4 py-3">
          <span className="text-sm font-semibold text-ink">{strings.cart.total}</span>
          <Price amount={total} className="text-xl font-bold text-primary-700" />
        </div>
        {hasStockIssues && (
          <p role="alert" className="mb-2 text-center text-sm text-warning">
            {strings.cart.adjustToContinue}
          </p>
        )}
        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={hasStockIssues}>
          {strings.cart.checkout}
        </Button>
      </div>
    </div>
  );
}
