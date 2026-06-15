import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductCard } from "@/components/molecules/ProductCard";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";
import type { ProductFilters } from "@/services/product.service";

interface ProductListProps {
  products: ProductDto[];
  filters?: ProductFilters;
}

export function ProductList({ products, filters }: ProductListProps) {
  if (products.length === 0) {
    const isFiltered = Boolean(filters?.search ?? filters?.category);
    return (
      <EmptyState
        icon="🔍"
        title={strings.products.empty}
        message={isFiltered ? strings.products.emptyHint : undefined}
      />
    );
  }

  return (
    <ul
      className="grid grid-cols-2 gap-3"
      aria-label={`${products.length} productos encontrados`}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
