"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useState, useTransition } from "react";

import {
  addBatchAction,
  type BatchFormState,
  deleteBatchAction,
} from "@/app/_actions/batch.action";
import { Input } from "@/components/atoms/Input";
import { SubmitButton } from "@/components/molecules/SubmitButton";
import { strings } from "@/lib/strings";
import type { ProductBatchDto } from "@/repositories/batch.repo";

interface ProductBatchManagerProps {
  productId: string;
  batches: ProductBatchDto[];
}

function formatDate(date: Date | null): string {
  if (!date) return strings.management.batches.noExpiry;
  return new Date(date).toLocaleDateString("es-VE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ProductBatchManager({ productId, batches }: ProductBatchManagerProps) {
  const b = strings.management.batches;
  const addAction = addBatchAction.bind(null, productId);
  const [state, formAction] = useActionState<BatchFormState, FormData>(addAction, null);
  const fieldErrors = state?.fieldErrors;

  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, startDelete] = useTransition();

  function handleDelete(id: string) {
    setDeleteError(null);
    startDelete(async () => {
      const result = await deleteBatchAction(id, productId);
      if (!result.ok) setDeleteError(result.error);
    });
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div>
        <h2 className="text-sm font-semibold text-ink">{b.title}</h2>
        <p className="mt-0.5 text-xs text-muted">{b.subtitle}</p>
      </div>

      {batches.length === 0 ? (
        <p className="text-sm text-muted">{b.empty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border" role="list">
          {batches.map((batch) => (
            <li key={batch.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0 text-sm">
                <span className="font-medium text-ink">{batch.lotNumber}</span>
                <span className="ml-2 text-muted">
                  {formatDate(batch.expiresAt)} · {batch.stock} {b.stock.toLowerCase()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(batch.id)}
                disabled={isDeleting}
                aria-label={b.delete}
                className="shrink-0 rounded-lg p-2 text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger disabled:opacity-50"
              >
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {deleteError && (
        <p role="alert" className="text-sm text-danger">
          {deleteError}
        </p>
      )}

      <form action={formAction} noValidate className="flex flex-col gap-3 border-t border-border pt-3">
        {state?.error && (
          <p role="alert" className="rounded-xl bg-danger-bg p-3 text-sm text-danger">
            {state.error}
          </p>
        )}
        <Input
          label={b.lotNumber}
          name="lotNumber"
          error={fieldErrors?.lotNumber}
          maxLength={60}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label={b.expiresAt} name="expiresAt" type="date" error={fieldErrors?.expiresAt} />
          <Input
            label={b.stock}
            name="stock"
            type="number"
            step="1"
            min="0"
            inputMode="numeric"
            defaultValue={0}
            error={fieldErrors?.stock}
            required
          />
        </div>
        <SubmitButton label={b.add} pendingLabel={b.adding} />
      </form>
    </section>
  );
}
