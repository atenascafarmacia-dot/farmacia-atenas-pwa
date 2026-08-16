"use server";

import { revalidatePath } from "next/cache";

import { strings } from "@/lib/strings";
import { exchangeRateSchema } from "@/schemas/setting.schema";
import { isCurrentUserOperator } from "@/services/session.service";
import { setExchangeRates } from "@/services/setting.service";

export type ExchangeRateFormState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Partial<Record<"vesRate" | "copRate", string>>;
} | null;

export async function updateExchangeRateAction(
  _prev: ExchangeRateFormState,
  formData: FormData,
): Promise<ExchangeRateFormState> {
  if (!(await isCurrentUserOperator())) {
    return { ok: false, error: strings.management.forbidden };
  }

  const parsed = exchangeRateSchema.safeParse({
    vesRate: formData.get("vesRate"),
    copRate: formData.get("copRate"),
  });
  if (!parsed.success) {
    const fieldErrors: Partial<Record<"vesRate" | "copRate", string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "vesRate" | "copRate" | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, fieldErrors };
  }

  try {
    await setExchangeRates(parsed.data);
  } catch {
    return { ok: false, error: strings.operator.settings.saveError };
  }

  revalidatePath("/operador/configuracion");
  return { ok: true };
}
