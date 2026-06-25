import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateProductAction } from "@/app/_actions/product.action";
import { BackButton } from "@/components/molecules/BackButton";
import { ProductBatchManager } from "@/components/organisms/ProductBatchManager";
import { ProductForm } from "@/components/organisms/ProductForm";
import { strings } from "@/lib/strings";
import {
  getCategories,
  getProductBatches,
  getProductForManagement,
} from "@/services/product.service";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductForManagement(id);
  return {
    title: product
      ? `${product.name} — ${strings.management.form.editTitle}`
      : strings.management.form.editTitle,
  };
}

export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;

  const [product, categories, batches] = await Promise.all([
    getProductForManagement(id),
    getCategories(),
    getProductBatches(id),
  ]);
  if (!product) notFound();

  // Bind the product id so the form action keeps the (prev, formData) shape.
  const action = updateProductAction.bind(null, id);

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-ink">
          {strings.management.form.editTitle}
        </h1>
      </header>

      <ProductForm action={action} categories={categories} product={product} />

      <ProductBatchManager productId={product.id} batches={batches} />
    </section>
  );
}
