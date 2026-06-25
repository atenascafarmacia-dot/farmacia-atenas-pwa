"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";

import { strings } from "@/lib/strings";
import { type AddressInput, addressSchema } from "@/schemas/address.schema";
import { createAddress, deleteAddress, updateAddress } from "@/services/address.service";
import { getCurrentUser } from "@/services/session.service";

export type AddressFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<keyof AddressInput, string>>;
} | null;

function parseForm(formData: FormData) {
  return addressSchema.safeParse({
    label: formData.get("label"),
    address: formData.get("address"),
    city: formData.get("city"),
    state: formData.get("state"),
    zipCode: formData.get("zipCode"),
  });
}

function toFieldErrors(
  error: z.ZodError<AddressInput>,
): Partial<Record<keyof AddressInput, string>> {
  const fieldErrors: Partial<Record<keyof AddressInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof AddressInput | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function revalidateAddresses(): void {
  revalidatePath("/direcciones");
  // The checkout form reads the same address book.
  revalidatePath("/checkout");
}

export async function createAddressAction(
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: strings.addresses.form.notIdentified };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    await createAddress(user.id, parsed.data);
  } catch {
    return { ok: false, error: strings.addresses.form.saveError };
  }

  revalidateAddresses();
  redirect("/direcciones");
}

export async function updateAddressAction(
  id: string,
  _prev: AddressFormState,
  formData: FormData,
): Promise<AddressFormState> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: strings.addresses.form.notIdentified };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { ok: false, fieldErrors: toFieldErrors(parsed.error) };
  }

  try {
    const updated = await updateAddress(id, user.id, parsed.data);
    if (!updated) return { ok: false, error: strings.addresses.form.saveError };
  } catch {
    return { ok: false, error: strings.addresses.form.saveError };
  }

  revalidateAddresses();
  redirect("/direcciones");
}

export type DeleteAddressResult = { ok: true } | { ok: false; error: string };

export async function deleteAddressAction(id: string): Promise<DeleteAddressResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: strings.addresses.remove.error };

  try {
    const removed = await deleteAddress(id, user.id);
    if (!removed) return { ok: false, error: strings.addresses.remove.error };
  } catch {
    return { ok: false, error: strings.addresses.remove.error };
  }

  revalidateAddresses();
  return { ok: true };
}
