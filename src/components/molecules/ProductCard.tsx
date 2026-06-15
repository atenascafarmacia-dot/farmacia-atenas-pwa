"use client";

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { Icon } from "@/components/atoms/Icon";
import { Price } from "@/components/atoms/Price";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";

interface ProductCardProps {
  product: ProductDto;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <div
        className="flex aspect-square w-full items-center justify-center rounded-xl bg-zinc-50"
        aria-hidden="true"
      >
        <span className="text-5xl">💊</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap gap-1">
          <Badge variant="info">{product.category}</Badge>
          {product.requiresPrescription && (
            <Badge variant="warning">{strings.products.prescription}</Badge>
          )}
          {outOfStock && <Badge variant="danger">{strings.products.outOfStock}</Badge>}
        </div>

        <h3 className="text-sm font-semibold leading-tight text-zinc-900">{product.name}</h3>

        {product.description && (
          <p className="line-clamp-2 text-xs text-zinc-500">{product.description}</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Price amount={product.price} className="text-lg text-green-700" />
        <Button
          size="sm"
          variant={outOfStock ? "secondary" : "primary"}
          disabled={outOfStock}
          onClick={() => onAddToCart?.(product.id)}
          aria-label={`${strings.products.addToCart}: ${product.name}`}
        >
          {outOfStock ? (
            strings.products.outOfStock
          ) : (
            <>
              <Icon name="plus" size={14} />
              {strings.products.addToCart}
            </>
          )}
        </Button>
      </div>
    </article>
  );
}
