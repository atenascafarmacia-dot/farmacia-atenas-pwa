"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { strings } from "@/lib/strings";
import { completeOrder } from "@/services/order.service";

const completeOrderSchema = z.object({
  orderId: z.cuid(),
  code: z.string().min(1),
});

export type CompleteOrderActionResult = { ok: true } | { ok: false; error: string };

/** Marks an order as COMPLETADA and revalidates the views that show it. */
export async function completeOrderAction(input: unknown): Promise<CompleteOrderActionResult> {
  const parsed = completeOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: strings.operator.completeError };
  }

  try {
    await completeOrder(parsed.data.orderId);
  } catch {
    return { ok: false, error: strings.operator.completeError };
  }

  revalidatePath("/operador");
  revalidatePath(`/pedido/${parsed.data.code}`);
  return { ok: true };
}
