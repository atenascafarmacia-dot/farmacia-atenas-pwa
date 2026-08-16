"use server";

import { revalidatePath } from "next/cache";
import type { z } from "zod";

import { strings } from "@/lib/strings";
import { type BatchInput, batchSchema } from "@/schemas/batch.schema";
import { addProductBatch, removeProductBatch } from "@/services/product.service";
import { isCurrentUserOperator } from "@/services/session.service";

export type BatchFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof BatchInput, string>>;
} | null;

/** Batches now move Product.stock, so the catalog and management list change too. */
function revalidateAfterStockChange(productId: string) {
  revalidatePath(`/operador/productos/${productId}/editar`);
  revalidatePath("/operador/productos");
  revalidatePath("/catalogo");
}

function toFieldErrors(error: z.ZodError<BatchInput>): Partial<Record<keyof BatchInput, string>> {
  const fieldErrors: Partial<Record<keyof BatchInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof BatchInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function addBatchAction(
  productId: string,
  _prev: BatchFormState,
  formData: FormData,
): Promise<BatchFormState> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.forbidden };
  }

  const parsed = batchSchema.safeParse({
    lotNumber: formData.get("lotNumber"),
    expiresAt: formData.get("expiresAt"),
    stock: formData.get("stock"),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    const result = await addProductBatch(productId, parsed.data);
    if (!result.ok) {
      return {
        ok: false,
        fieldErrors: { lotNumber: strings.management.batches.duplicateLot },
      };
    }
  } catch {
    return { ok: false, error: strings.management.batches.addError };
  }

  revalidateAfterStockChange(productId);
  return { ok: true };
}

export type DeleteBatchResult = { ok: true } | { ok: false; error: string };

export async function deleteBatchAction(id: string, productId: string): Promise<DeleteBatchResult> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.batches.deleteError };
  }

  try {
    await removeProductBatch(id, productId);
  } catch {
    return { ok: false, error: strings.management.batches.deleteError };
  }

  revalidateAfterStockChange(productId);
  return { ok: true };
}
