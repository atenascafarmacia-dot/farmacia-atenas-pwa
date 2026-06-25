import { FileText } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { AddToCartButton } from "@/components/molecules/AddToCartButton";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";

interface ProductCardProps {
  product: ProductDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock === 0;

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      {/* Only the image + text block is the navigation target; the Add button
          stays a sibling outside the Link to keep valid, accessible markup. */}
      <Link
        href={`/producto/${product.id}`}
        className="flex flex-col gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        <ProductThumb
          imageUrl={product.imageUrl}
          name={product.name}
          category={product.category.name}
          className="aspect-square w-full"
          iconClassName="h-12 w-12"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="neutral" className="tracking-wide [font-variant:small-caps]">
              {product.category.name}
            </Badge>
            {product.requiresPrescription && (
              <Badge variant="warning">
                <FileText className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
                {strings.products.prescription}
              </Badge>
            )}
            {outOfStock && <Badge variant="danger">{strings.products.outOfStock}</Badge>}
          </div>

          <h3 className="text-sm font-semibold leading-tight text-ink">{product.name}</h3>

          {product.description && (
            <p className="line-clamp-2 text-xs text-muted">{product.description}</p>
          )}
        </div>
      </Link>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
        <Price amount={product.price} className="text-lg font-bold text-primary-700" />
        <AddToCartButton
          productId={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.imageUrl}
          outOfStock={outOfStock}
        />
      </div>
    </article>
  );
}
