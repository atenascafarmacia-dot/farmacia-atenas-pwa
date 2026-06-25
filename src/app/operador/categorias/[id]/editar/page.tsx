import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { updateCategoryAction } from "@/app/_actions/category.action";
import { BackButton } from "@/components/molecules/BackButton";
import { CategoryForm } from "@/components/organisms/CategoryForm";
import { strings } from "@/lib/strings";
import { getCategoryForManagement } from "@/services/category.service";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryForManagement(id);
  return {
    title: category
      ? `${category.name} — ${strings.management.categories.form.editTitle}`
      : strings.management.categories.form.editTitle,
  };
}

export default async function EditCategoryPage({ params }: { params: Params }) {
  const { id } = await params;

  const category = await getCategoryForManagement(id);
  if (!category) notFound();

  // Bind the category id so the form action keeps the (prev, formData) shape.
  const action = updateCategoryAction.bind(null, id);

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <h1 className="text-xl font-bold text-ink">
          {strings.management.categories.form.editTitle}
        </h1>
      </header>

      <CategoryForm action={action} category={category} />
    </section>
  );
}
