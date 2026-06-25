"use client";

import { useState, useTransition } from "react";

import { markOrderPaidAction } from "@/app/_actions/operator.action";
import { Button } from "@/components/atoms/Button";
import { strings } from "@/lib/strings";

interface MarkOrderPaidButtonProps {
  orderId: string;
  code: string;
}

/** Marks an order's payment as PAGADO; the action's revalidate refreshes the view. */
export function MarkOrderPaidButton({ orderId, code }: MarkOrderPaidButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await markOrderPaidAction({ orderId, code });
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <Button variant="soft" className="w-full" loading={isPending} onClick={handleClick}>
        {strings.operator.payment.markPaid}
      </Button>
    </div>
  );
}
