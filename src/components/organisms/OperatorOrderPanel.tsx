import { Badge } from "@/components/atoms/Badge";
import { Price } from "@/components/atoms/Price";
import { CompleteOrderButton } from "@/components/molecules/CompleteOrderButton";
import { strings } from "@/lib/strings";
import type { OrderDetailDto, OrderStatus } from "@/repositories/order.repo";

const STATUS_VARIANT: Record<OrderStatus, "warning" | "info" | "success" | "danger"> = {
  PENDIENTE: "warning",
  PROCESANDO: "info",
  COMPLETADA: "success",
  CANCELADA: "danger",
};

interface OperatorOrderPanelProps {
  order: OrderDetailDto;
}

/** Read-only order detail for the operator, plus the complete-order action. */
export function OperatorOrderPanel({ order }: OperatorOrderPanelProps) {
  const isCompleted = order.status === "COMPLETADA";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
        <span className="font-mono text-lg font-bold tracking-widest text-ink">
          {order.code}
        </span>
        <Badge variant={STATUS_VARIANT[order.status]}>
          {strings.orders.statusLabel[order.status]}
        </Badge>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {strings.operator.customer}
        </h2>
        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.customer}</dt>
            <dd className="text-right font-medium text-ink">{order.user.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.phone}</dt>
            <dd className="text-right text-ink">{order.user.phone}</dd>
          </div>
          {order.user.email && (
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{strings.operator.email}</dt>
              <dd className="text-right text-ink">{order.user.email}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
          {strings.operator.items}
        </h2>
        <ul className="flex flex-col divide-y divide-border" role="list">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex-1 text-sm text-ink">
                {item.product.name}
                <span className="ml-1 text-muted">×{item.quantity}</span>
              </span>
              <Price
                amount={item.unitPrice * item.quantity}
                className="text-sm text-ink"
              />
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold text-ink">
            {strings.operator.total}
          </span>
          <Price amount={order.total} className="text-lg font-bold text-primary-700" />
        </div>
      </div>

      {isCompleted ? (
        <p className="rounded-xl bg-success-bg px-4 py-3 text-center text-sm font-medium text-success">
          {strings.operator.alreadyCompleted}
        </p>
      ) : (
        <CompleteOrderButton orderId={order.id} code={order.code} />
      )}
    </div>
  );
}
