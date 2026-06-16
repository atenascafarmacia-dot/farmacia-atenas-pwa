"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteProductAction } from "@/app/_actions/product.action";
import { ConfirmDialog } from "@/components/organisms/ConfirmDialog";
import { strings } from "@/lib/strings";

interface DeleteProductButtonProps {
  id: string;
  name: string;
}

/** Delete action with an accessible confirmation dialog (soft-delete). */
export function DeleteProductButton({ id, name }: DeleteProductButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteProductAction(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setOpen(false);
      router.refresh();
    });
  }

  function handleClose() {
    if (pending) return;
    setOpen(false);
    setError(null);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${strings.management.delete}: ${name}`}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>

      {open && (
        <ConfirmDialog
          title={strings.management.remove.title}
          message={strings.management.remove.message(name)}
          confirmLabel={strings.management.remove.confirm}
          cancelLabel={strings.management.remove.cancel}
          danger
          pending={pending}
          error={error}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      )}
    </>
  );
}
