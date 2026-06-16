import { FileText } from "lucide-react";

import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { ProductThumb } from "@/components/atoms/ProductThumb";
import { Wordmark } from "@/components/atoms/Wordmark";
import { BackButton } from "@/components/molecules/BackButton";
import { ProductCard } from "@/components/molecules/ProductCard";
import { ProductDetailActions } from "@/components/organisms/ProductDetailActions";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";

/** Stable id so the modal can reference the title via aria-labelledby. */
export const PRODUCT_DETAIL_TITLE_ID = "product-detail-title";

interface ProductDetailProps {
  product: ProductDto;
  related: ProductDto[];
}

/** Shared product detail UI — rendered by both the full page and the modal. */
export function ProductDetail({ product, related }: ProductDetailProps) {
  const outOfStock = product.stock === 0;

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <Wordmark />
      </header>

      <ProductThumb
        imageUrl={product.imageUrl}
        name={product.name}
        category={product.category}
        className="aspect-square w-full"
        iconClassName="h-20 w-20"
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="neutral" className="tracking-wide [font-variant:small-caps]">
            {product.category}
          </Badge>
          {product.requiresPrescription && (
            <Badge variant="warning">
              <FileText className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              {strings.products.prescription}
            </Badge>
          )}
        </div>

        <h1
          id={PRODUCT_DETAIL_TITLE_ID}
          className="text-xl font-bold leading-tight text-ink"
        >
          {product.name}
        </h1>

        {product.description && (
          <p className="text-sm leading-relaxed text-muted">{product.description}</p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <Price amount={product.price} className="text-2xl font-bold text-primary-700" />
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium ${
            outOfStock ? "text-danger" : "text-success"
          }`}
        >
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full ${outOfStock ? "bg-danger" : "bg-success"}`}
          />
          {outOfStock
            ? strings.products.detail.unavailable
            : strings.products.detail.available}
        </span>
      </div>

      <ProductDetailActions
        productId={product.id}
        name={product.name}
        price={product.price}
        imageUrl={product.imageUrl}
        outOfStock={outOfStock}
      />

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="flex flex-col gap-3 pt-2">
          <h2 id="related-title" className="text-sm font-semibold text-ink">
            {strings.products.detail.related}
          </h2>
          <ul className="grid grid-cols-2 gap-3">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  );
}
