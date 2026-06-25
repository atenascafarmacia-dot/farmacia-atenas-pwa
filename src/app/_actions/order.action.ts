"use server";

import { revalidatePath } from "next/cache";

import { strings } from "@/lib/strings";
import { createOrder } from "@/services/order.service";
import { getCurrentUser } from "@/services/session.service";

export type CreateOrderActionResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

/**
 * Places an order for the current session from the checkout payload (cart items
 * plus delivery / payment / shipping details). Returns the order code so the
 * client can clear its cart and navigate to /pedido/[code]; we don't redirect
 * here because the cart lives in the client store. All fields are validated and
 * the total is recomputed server-side in the service/repository.
 */
export async function createOrderAction(input: unknown): Promise<CreateOrderActionResult> {
  if (typeof input !== "object" || input === null) {
    return { ok: false, error: strings.orders.create.invalid };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: strings.orders.create.notIdentified };
  }

  const result = await createOrder({ ...(input as Record<string, unknown>), userId: user.id });
  if (!result.ok) {
    return result;
  }

  // Stock changed and the new order page must render fresh data.
  revalidatePath("/catalogo");
  revalidatePath(`/pedido/${result.data.code}`);

  return { ok: true, code: result.data.code };
}
