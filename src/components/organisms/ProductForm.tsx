"use client";

import Link from "next/link";
import { useActionState } from "react";

import type { ProductFormState } from "@/app/_actions/product.action";
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { strings } from "@/lib/strings";
import type { ProductDto } from "@/repositories/product.repo";

interface ProductFormProps {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  /** Present in edit mode to prefill the fields. */
  product?: ProductDto;
}

export function ProductForm({ action, product }: ProductFormProps) {
  const [state, formAction] = useActionState<ProductFormState, FormData>(action, null);
  const fieldErrors = state?.fieldErrors;
  const f = strings.management.form;

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
        defaultValue={product?.name}
        error={fieldErrors?.name}
        maxLength={120}
        required
      />

      <Input
        label={f.category}
        name="category"
        defaultValue={product?.category}
        error={fieldErrors?.category}
        required
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label={f.price}
          name="price"
          type="number"
          step="0.01"
          min="0"
          inputMode="decimal"
          defaultValue={product?.price}
          error={fieldErrors?.price}
          required
        />
        <Input
          label={f.stock}
          name="stock"
          type="number"
          step="1"
          min="0"
          inputMode="numeric"
          defaultValue={product?.stock}
          error={fieldErrors?.stock}
          required
        />
      </div>

      <Input
        label={f.imageUrl}
        name="imageUrl"
        type="url"
        placeholder="https://..."
        defaultValue={product?.imageUrl ?? ""}
        error={fieldErrors?.imageUrl}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-ink">
          {f.description}
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-base text-ink placeholder:text-muted/70 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {fieldErrors?.description && (
          <p role="alert" className="text-sm text-danger">
            {fieldErrors.description}
          </p>
        )}
      </div>

      <label className="flex min-h-[44px] items-center gap-2.5 text-sm text-ink">
        <input
          type="checkbox"
          name="requiresPrescription"
          defaultChecked={product?.requiresPrescription ?? false}
          className="h-5 w-5 rounded border-border text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500"
        />
        {f.requiresPrescription}
      </label>

      <div className="mt-1 flex gap-3">
        <Link
          href="/operador/productos"
          className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-border text-sm font-medium text-ink transition-colors hover:bg-primary-50"
        >
          {f.cancel}
        </Link>
        <SubmitButton label={f.save} pendingLabel={f.saving} className="flex-1" />
      </div>
    </form>
  );
}
