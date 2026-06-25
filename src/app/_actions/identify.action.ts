"use server";

import { redirect } from "next/navigation";

import { userIdentificationSchema } from "@/schemas/user.schema";
import { findOrCreateUser, isOperator, setSession } from "@/services/session.service";

export type IdentifyActionState = {
  ok: false;
  errors: Partial<Record<"name" | "phone", string>>;
  generalError?: string;
} | null;

export async function identifyAction(
  _prev: IdentifyActionState,
  formData: FormData,
): Promise<IdentifyActionState> {
  const parsed = userIdentificationSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    const errors: Partial<Record<"name" | "phone", string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "name" || field === "phone") {
        errors[field] = issue.message;
      }
    }
    return { ok: false, errors };
  }

  let user;
  try {
    user = await findOrCreateUser(parsed.data.name, parsed.data.phone);
  } catch {
    return {
      ok: false,
      errors: {},
      generalError: "No se pudo procesar la solicitud. Intenta de nuevo.",
    };
  }

  await setSession(user.id);
  // Operators land on their dashboard; customers on the catalog.
  redirect(isOperator(user) ? "/operador" : "/catalogo");
}
