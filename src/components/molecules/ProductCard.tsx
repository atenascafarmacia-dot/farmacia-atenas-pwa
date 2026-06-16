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
    <article className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
      <ProductThumb
        imageUrl={product.imageUrl}
        name={product.name}
        category={product.category}
        className="aspect-square w-full"
        iconClassName="h-12 w-12"
      />

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
