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

function toFieldErrors(
  error: z.ZodError<BatchInput>,
): Partial<Record<keyof BatchInput, string>> {
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
    await addProductBatch(productId, parsed.data);
  } catch {
    return { ok: false, error: strings.management.batches.addError };
  }

  revalidatePath(`/operador/productos/${productId}/editar`);
  return { ok: true };
}

export type DeleteBatchResult = { ok: true } | { ok: false; error: string };

export async function deleteBatchAction(
  id: string,
  productId: string,
): Promise<DeleteBatchResult> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.batches.deleteError };
  }

  try {
    await removeProductBatch(id, productId);
  } catch {
    return { ok: false, error: strings.management.batches.deleteError };
  }

  revalidatePath(`/operador/productos/${productId}/editar`);
  return { ok: true };
}
