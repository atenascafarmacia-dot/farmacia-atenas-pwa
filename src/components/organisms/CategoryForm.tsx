"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { CategoryFormState } from "@/app/_actions/category.action";
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { strings } from "@/lib/strings";
import type { CategoryDto } from "@/repositories/category.repo";

interface CategoryFormProps {
  action: (prev: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  /** Present in edit mode to prefill the field. */
  category?: CategoryDto;
}

export function CategoryForm({ action, category }: CategoryFormProps) {
  const [state, formAction] = useActionState<CategoryFormState, FormData>(action, null);
  const f = strings.management.categories.form;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      {state?.error && (
        <p role="alert" className="rounded-xl bg-danger-bg p-3 text-sm text-danger">
          {state.error}
        </p>
      )}

      <Input
        label={f.name}
        name="name"
        defaultValue={category?.name}
        error={state?.fieldErrors?.name}
        maxLength={60}
        required
      />

      <div className="mt-1 flex gap-3">
        <Link
          href="/operador/categorias"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-ink transition-colors hover:bg-primary-50"
        >
          {f.cancel}
        </Link>
        <SubmitButton label={f.save} pendingLabel={f.saving} className="flex-1" />
      </div>
    </form>
  );
}
