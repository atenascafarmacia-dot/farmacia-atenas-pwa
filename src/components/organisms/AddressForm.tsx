"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { AddressFormState } from "@/app/_actions/address.action";
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { strings } from "@/lib/strings";
import type { AddressDto } from "@/services/address.service";

interface AddressFormProps {
  action: (prev: AddressFormState, formData: FormData) => Promise<AddressFormState>;
  /** Present in edit mode to prefill the fields. */
  address?: AddressDto;
}

export function AddressForm({ action, address }: AddressFormProps) {
  const [state, formAction] = useActionState<AddressFormState, FormData>(action, null);
  const fieldErrors = state?.fieldErrors;
  const f = strings.addresses.form;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state?.error && (
        <p role="alert" className="rounded-xl bg-danger-bg p-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <Input
          label={f.label}
          name="label"
          placeholder={f.labelPlaceholder}
          defaultValue={address?.label ?? ""}
          error={fieldErrors?.label}
          maxLength={40}
        />
        <p className="text-xs text-muted">{f.labelHint}</p>
      </div>

      <Input
        label={f.address}
        name="address"
        placeholder={f.addressPlaceholder}
        defaultValue={address?.address}
        error={fieldErrors?.address}
        maxLength={200}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label={f.city}
          name="city"
          defaultValue={address?.city}
          error={fieldErrors?.city}
          maxLength={80}
          required
        />
        <Input
          label={f.state}
          name="state"
          defaultValue={address?.state}
          error={fieldErrors?.state}
          maxLength={80}
          required
        />
      </div>

      <Input
        label={`${f.zipCode} (${f.zipOptional})`}
        name="zipCode"
        defaultValue={address?.zipCode ?? ""}
        error={fieldErrors?.zipCode}
        maxLength={20}
      />

      <div className="mt-1 flex gap-3">
        <Link
          href="/direcciones"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-ink transition-colors hover:bg-primary-50"
        >
          {f.cancel}
        </Link>
        <SubmitButton label={f.save} pendingLabel={f.saving} className="flex-1" />
      </div>
    </form>
  );
}
