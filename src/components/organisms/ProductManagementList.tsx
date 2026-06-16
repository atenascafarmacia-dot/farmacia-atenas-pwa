import Link from "next/link";

import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { DeleteProductButton } from "@/components/molecules/DeleteProductButton";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";

interface ProductManagementListProps {
  products: ProductDto[];
}

/** Management list: every product, inactive ones visually marked. */
export function ProductManagementList({ products }: ProductManagementListProps) {
  return (
    <ul className="flex flex-col gap-2" aria-label={strings.management.title}>
      {products.map((product) => (
        <li
          key={product.id}
          className={`flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft ${
            product.isActive ? "" : "opacity-60"
          }`}
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-ink">{product.name}</h2>
              {!product.isActive && (
                <Badge variant="neutral">{strings.management.inactive}</Badge>
              )}
            </div>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
              <span className="[font-variant:small-caps]">{product.category}</span>
              <span aria-hidden="true">·</span>
              <Price amount={product.price} className="text-xs text-ink" />
              <span aria-hidden="true">·</span>
              <span>Stock {product.stock}</span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/operador/productos/${product.id}/editar`}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {strings.management.edit}
            </Link>
            <DeleteProductButton id={product.id} name={product.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}
