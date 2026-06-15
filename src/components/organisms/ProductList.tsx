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
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <span aria-hidden="true" className="text-5xl">🔍</span>
        <p className="text-base font-medium text-zinc-700">{strings.products.empty}</p>
        {(filters?.search ?? filters?.category) && (
          <p className="text-sm text-zinc-400">Intenta con otro término o categoría.</p>
        )}
      </div>
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
