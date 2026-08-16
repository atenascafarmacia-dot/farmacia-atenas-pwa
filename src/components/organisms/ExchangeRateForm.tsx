"use client";

import { useActionState } from "react";

import {
  type ExchangeRateFormState,
  updateExchangeRateAction,
} from "@/app/_actions/setting.action";
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { strings } from "@/lib/strings";

interface ExchangeRateFormProps {
  /** Current Bs-per-USD rate, or null when not configured. */
  currentVesRate: number | null;
  /** Current COP-per-USD rate, or null when not configured. */
  currentCopRate: number | null;
}

export function ExchangeRateForm({ currentVesRate, currentCopRate }: ExchangeRateFormProps) {
  const s = strings.operator.settings;
  const [state, formAction] = useActionState<ExchangeRateFormState, FormData>(
    updateExchangeRateAction,
    null,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state?.error && (
        <p role="alert" className="rounded-xl bg-danger-bg p-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      {/* type="text": iOS rejects comma decimals on type="number" inputs. */}
      <Input
        label={s.vesRateLabel}
        name="vesRate"
        type="text"
        inputMode="decimal"
        defaultValue={currentVesRate ?? ""}
        error={state?.fieldErrors?.vesRate}
      />
      <Input
        label={s.copRateLabel}
        name="copRate"
        type="text"
        inputMode="decimal"
        defaultValue={currentCopRate ?? ""}
        error={state?.fieldErrors?.copRate}
      />
      <p className="-mt-2 text-xs text-muted">{s.rateHint}</p>

      <SubmitButton label={s.save} pendingLabel={s.saving} />

      {state?.ok && (
        <p role="status" className="text-center text-sm font-medium text-success">
          {s.saved}
        </p>
      )}
    </form>
  );
}
