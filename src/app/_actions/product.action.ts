"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";

import { strings } from "@/lib/strings";
import { type ProductInput, productSchema } from "@/schemas/product.schema";
import { createProduct, deleteProduct, updateProduct } from "@/services/product.service";

export type ProductFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof ProductInput, string>>;
} | null;

function parseForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    category: formData.get("category"),
    imageUrl: formData.get("imageUrl"),
    requiresPrescription: formData.get("requiresPrescription") === "on",
  });
}

function toFieldErrors(
  error: z.ZodError<ProductInput>,
): Partial<Record<keyof ProductInput, string>> {
  const fieldErrors: Partial<Record<keyof ProductInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof ProductInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function revalidateProducts(): void {
  revalidatePath("/catalogo");
  revalidatePath("/operador/productos");
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    await createProduct(parsed.data);
  } catch {
    return { ok: false, error: strings.management.form.saveError };
  }

  revalidateProducts();
  redirect("/operador/productos");
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    await updateProduct(id, parsed.data);
  } catch {
    return { ok: false, error: strings.management.form.saveError };
  }

  revalidateProducts();
  redirect("/operador/productos");
}

export type DeleteProductResult = { ok: true } | { ok: false; error: string };

export async function deleteProductAction(id: string): Promise<DeleteProductResult> {
  try {
    await deleteProduct(id);
  } catch {
    return { ok: false, error: strings.management.remove.error };
  }

  revalidateProducts();
  return { ok: true };
}
