"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteCategoryAction } from "@/app/_actions/category.action";
import { ConfirmDialog } from "@/components/organisms/ConfirmDialog";
import { strings } from "@/lib/strings";

interface DeleteCategoryButtonProps {
  id: string;
  name: string;
}

/** Delete action with an accessible confirmation dialog (blocked if in use). */
export function DeleteCategoryButton({ id, name }: DeleteCategoryButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const r = strings.management.categories.remove;

  function handleConfirm() {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
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
        aria-label={`${r.title}: ${name}`}
        className="flex h-11 w-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
      >
        <Trash2 size={18} aria-hidden="true" />
      </button>

      {open && (
        <ConfirmDialog
          title={r.title}
          message={r.message(name)}
          confirmLabel={r.confirm}
          cancelLabel={r.cancel}
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
