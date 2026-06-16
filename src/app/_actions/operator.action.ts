"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { strings } from "@/lib/strings";
import { updateOrderStatusSchema } from "@/schemas/order.schema";
import { completeOrder, setOrderStatus } from "@/services/order.service";

const completeOrderSchema = z.object({
  orderId: z.cuid(),
  code: z.string().min(1),
});

export type CompleteOrderActionResult = { ok: true } | { ok: false; error: string };

/** Revalidates every operator/customer view that renders the given order. */
function revalidateOrderViews(code: string) {
  revalidatePath("/operador");
  revalidatePath("/operador/ordenes");
  revalidatePath(`/operador/ordenes/${code}`);
  revalidatePath(`/pedido/${code}`);
}

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

  revalidateOrderViews(parsed.data.code);
  return { ok: true };
}

export type UpdateOrderStatusActionResult = { ok: true } | { ok: false; error: string };

/** Moves an order to PROCESANDO / CANCELADA (or any valid status) for the operator. */
export async function updateOrderStatusAction(
  input: unknown,
): Promise<UpdateOrderStatusActionResult> {
  const parsed = updateOrderStatusSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: strings.operator.orders.updateError };
  }

  try {
    await setOrderStatus(parsed.data.orderId, parsed.data.status);
  } catch {
    return { ok: false, error: strings.operator.orders.updateError };
  }

  revalidateOrderViews(parsed.data.code);
  return { ok: true };
}
