"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  identifyAction,
  type IdentifyActionState,
} from "@/app/_actions/identify.action";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="w-full">
      Continuar
    </Button>
  );
}

export function IdentifyForm() {
  const [state, formAction] = useActionState<IdentifyActionState, FormData>(
    identifyAction,
    null,
  );

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state?.generalError && (
        <p role="alert" className="rounded-xl bg-danger-bg p-3 text-sm text-danger">
          {state.generalError}
        </p>
      )}

      <Input
        label="Nombre completo"
        name="name"
        type="text"
        placeholder="José García"
        autoComplete="name"
        error={state?.errors?.name}
        required
      />

      <Input
        label="Teléfono"
        name="phone"
        type="tel"
        placeholder="04141234567"
        autoComplete="tel"
        error={state?.errors?.phone}
        required
      />

      <SubmitButton />
    </form>
  );
}
