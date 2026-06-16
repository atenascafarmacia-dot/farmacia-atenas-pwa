import type { Metadata } from "next";

import { createProductAction } from "@/app/_actions/product.action";
import { BackButton } from "@/components/molecules/BackButton";
import { ProductForm } from "@/components/organisms/ProductForm";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: `${strings.management.form.newTitle} — ${strings.brand.name}`,
};

export default function NewProductPage() {
  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-ink">
          {strings.management.form.newTitle}
        </h1>
      </header>

      <ProductForm action={createProductAction} />
    </section>
  );
}
