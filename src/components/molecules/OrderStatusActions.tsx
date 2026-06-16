"use client";

import { useState, useTransition } from "react";

import { updateOrderStatusAction } from "@/app/_actions/operator.action";
import { Button } from "@/components/atoms/Button";
import { strings } from "@/lib/strings";
import type { OrderStatus } from "@/repositories/order.repo";

interface OrderStatusActionsProps {
  orderId: string;
  code: string;
  status: OrderStatus;
}

/**
 * Secondary status transitions for the operator (move to PROCESANDO / CANCELADA).
 * Completion lives in CompleteOrderButton; closed orders show nothing here.
 */
export function OrderStatusActions({ orderId, code, status }: OrderStatusActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Terminal statuses have no further transitions.
  if (status === "COMPLETADA" || status === "CANCELADA") return null;

  function update(next: OrderStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateOrderStatusAction({ orderId, code, status: next });
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
      <div className="flex gap-2">
        {status !== "PROCESANDO" && (
          <Button
            variant="soft"
            className="flex-1"
            loading={isPending}
            onClick={() => update("PROCESANDO")}
          >
            {strings.operator.orders.markProcessing}
          </Button>
        )}
        <Button
          variant="danger"
          className="flex-1"
          loading={isPending}
          onClick={() => update("CANCELADA")}
        >
          {strings.operator.orders.markCancelled}
        </Button>
      </div>
    </div>
  );
}
