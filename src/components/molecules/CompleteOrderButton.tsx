"use client";

import { useState, useTransition } from "react";

import { completeOrderAction } from "@/app/_actions/operator.action";
import { Button } from "@/components/atoms/Button";
import { strings } from "@/lib/strings";

interface CompleteOrderButtonProps {
  orderId: string;
  code: string;
}

/** Marks an order as completed; the revalidate in the action refreshes the view. */
export function CompleteOrderButton({ orderId, code }: CompleteOrderButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await completeOrderAction({ orderId, code });
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
      <Button className="w-full" size="lg" loading={isPending} onClick={handleClick}>
        {strings.operator.complete}
      </Button>
    </div>
  );
}
