"use server";

import { revalidatePath } from "next/cache";

import { strings } from "@/lib/strings";
import { cartSchema } from "@/schemas/cart.schema";
import { createOrder } from "@/services/order.service";
import { getCurrentUser } from "@/services/session.service";

export type CreateOrderActionResult =
  | { ok: true; code: string }
  | { ok: false; error: string };

/**
 * Places an order for the current session. Returns the order code so the
 * client can clear its cart and navigate to /pedido/[code]; we don't redirect
 * here because the cart lives in the client store.
 */
export async function createOrderAction(items: unknown): Promise<CreateOrderActionResult> {
  const parsedItems = cartSchema.safeParse(items);
  if (!parsedItems.success) {
    return {
      ok: false,
      error: parsedItems.error.issues[0]?.message ?? strings.orders.create.invalid,
    };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: strings.orders.create.notIdentified };
  }

  const result = await createOrder({ userId: user.id, items: parsedItems.data });
  if (!result.ok) {
    return result;
  }

  // Stock changed and the new order page must render fresh data.
  revalidatePath("/catalogo");
  revalidatePath(`/pedido/${result.data.code}`);

  return { ok: true, code: result.data.code };
}
