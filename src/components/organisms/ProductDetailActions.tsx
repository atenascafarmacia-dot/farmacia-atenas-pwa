"use client";

import { useState } from "react";

import { Button } from "@/components/atoms/Button";
import { QuantityStepper } from "@/components/molecules/QuantityStepper";
import { strings } from "@/lib/strings";
import { useCartStore } from "@/store/cart";

interface ProductDetailActionsProps {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
  stock: number;
}

const MAX_QUANTITY = 99;

/** Quantity picker + primary CTA that adds the chosen amount to the cart. */
export function ProductDetailActions({
  productId,
  name,
  price,
  imageUrl,
  stock,
}: ProductDetailActionsProps) {
  const add = useCartStore((s) => s.add);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const items = useCartStore((s) => s.items);

  const [quantity, setQuantity_] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock === 0) {
    return (
      <Button className="w-full" size="lg" disabled>
        {strings.products.outOfStock}
      </Button>
    );
  }

  const inCart = items.find((i) => i.productId === productId)?.quantity ?? 0;
  const maxAddable = Math.min(MAX_QUANTITY, stock) - inCart;

  if (maxAddable <= 0) {
    return (
      <div className="flex flex-col gap-3">
        <Button className="w-full" size="lg" disabled>
          {strings.cart.addItem}
        </Button>
        <p role="status" className="text-center text-sm text-muted">
          {strings.cart.maxReached}
        </p>
      </div>
    );
  }

  function handleAdd() {
    // Use the existing store API: ensure the item exists, then set the
    // absolute target quantity (current + chosen), never beyond the stock.
    add({ productId, name, price, imageUrl }, stock);
    setQuantity(productId, Math.min(MAX_QUANTITY, stock, inCart + quantity));
    setAdded(true);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-ink">{strings.products.detail.quantity}</span>
          <span className="text-xs text-muted">{strings.products.availableCount(stock)}</span>
        </div>
        <QuantityStepper
          value={quantity}
          onChange={(v) => {
            setQuantity_(v);
            setAdded(false);
          }}
          min={1}
          max={maxAddable}
        />
      </div>

      <Button className="w-full" size="lg" onClick={handleAdd}>
        {strings.cart.addItem}
      </Button>

      {added && (
        <p role="status" className="text-center text-sm font-medium text-success">
          {strings.products.detail.added}
        </p>
      )}
    </div>
  );
}
