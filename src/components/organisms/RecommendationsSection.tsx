import { ProductCard } from "@/components/molecules/ProductCard";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";

interface RecommendationsSectionProps {
  products: ProductDto[];
}

/** Horizontal "frequently bought" row, reusing ProductCard. */
export function RecommendationsSection({ products }: RecommendationsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="recommendations-title" className="flex flex-col gap-2">
      <h2 id="recommendations-title" className="text-sm font-semibold text-ink">
        {strings.products.frequentlyBought}
      </h2>
      <ul className="flex gap-3 overflow-x-auto pb-1" role="list">
        {products.map((product) => (
          <li key={product.id} className="w-40 flex-shrink-0">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
