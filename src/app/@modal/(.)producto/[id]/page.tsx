import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/organisms/ProductDetail";
import { ProductModal } from "@/components/organisms/ProductModal";
import { getProductById, getProducts } from "@/services/product.service";

type Params = Promise<{ id: string }>;

/**
 * Intercepted product route: on client navigation from the catalog this renders
 * the detail inside a modal. A direct URL / refresh skips the interception and
 * the full page (app/producto/[id]) renders instead.
 */
export default async function InterceptedProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product) notFound();

  const related = (await getProducts({ category: product.category }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductModal>
      <ProductDetail product={product} related={related} />
    </ProductModal>
  );
}
