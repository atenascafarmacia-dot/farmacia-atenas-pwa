"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { strings } from "@/lib/strings";
import { type CategoryInput, categorySchema } from "@/schemas/category.schema";
import { createCategory, deleteCategory, updateCategory } from "@/services/category.service";
import { isCurrentUserOperator } from "@/services/session.service";

export type CategoryFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof CategoryInput, string>>;
} | null;

function parseForm(formData: FormData) {
  return categorySchema.safeParse({ name: formData.get("name") });
}

/** Revalidates every view that lists categories. */
function revalidateCategories(): void {
  revalidatePath("/operador/categorias");
  // Product form select and catalog filters read the category list.
  revalidatePath("/catalogo");
  revalidatePath("/operador/productos/nuevo");
}

export async function createCategoryAction(
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.categories.forbidden };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message;
    return { ok: false, fieldErrors: { name: message } };
  }

  const result = await createCategory(parsed.data);
  if (!result.ok) {
    return result.reason === "DUPLICATE"
      ? { ok: false, fieldErrors: { name: strings.management.categories.form.duplicate } }
      : { ok: false, error: strings.management.categories.form.saveError };
  }

  revalidateCategories();
  redirect("/operador/categorias");
}

export async function updateCategoryAction(
  id: string,
  _prev: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.categories.forbidden };
  }

  const parsed = parseForm(formData);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message;
    return { ok: false, fieldErrors: { name: message } };
  }

  const result = await updateCategory(id, parsed.data);
  if (!result.ok) {
    return result.reason === "DUPLICATE"
      ? { ok: false, fieldErrors: { name: strings.management.categories.form.duplicate } }
      : { ok: false, error: strings.management.categories.form.saveError };
  }

  revalidateCategories();
  redirect("/operador/categorias");
}

export type DeleteCategoryResult = { ok: true } | { ok: false; error: string };

export async function deleteCategoryAction(id: string): Promise<DeleteCategoryResult> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.categories.forbidden };
  }

  const result = await deleteCategory(id);
  if (!result.ok) {
    return {
      ok: false,
      error:
        result.reason === "IN_USE"
          ? strings.management.categories.remove.inUse
          : strings.management.categories.remove.error,
    };
  }

  revalidateCategories();
  return { ok: true };
}
