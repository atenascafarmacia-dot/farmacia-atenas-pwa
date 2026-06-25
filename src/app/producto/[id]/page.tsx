import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/organisms/ProductDetail";
import { strings } from "@/lib/strings";
import { getProductById, getProducts } from "@/services/product.service";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  return {
    title: product
      ? `${product.name} — ${strings.brand.name}`
      : strings.products.detail.notFoundTitle,
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const product = await getProductById(id);
  if (!product) notFound();

  const related = (await getProducts({ categoryId: product.category.id }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
