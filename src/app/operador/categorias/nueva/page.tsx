import type { Metadata } from "next";

import { createCategoryAction } from "@/app/_actions/category.action";
import { BackButton } from "@/components/molecules/BackButton";
import { CategoryForm } from "@/components/organisms/CategoryForm";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: `${strings.management.categories.form.newTitle} — ${strings.brand.name}`,
};

export default function NewCategoryPage() {
  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-ink">
          {strings.management.categories.form.newTitle}
        </h1>
      </header>

      <CategoryForm action={createCategoryAction} />
    </section>
  );
}
