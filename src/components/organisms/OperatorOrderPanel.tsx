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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4">
        <span className="font-mono text-lg font-bold tracking-widest text-zinc-900">
          {order.code}
        </span>
        <Badge variant={STATUS_VARIANT[order.status]}>
          {strings.orders.statusLabel[order.status]}
        </Badge>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold text-zinc-900">
          {strings.operator.customer}
        </h2>
        <dl className="flex flex-col gap-1 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">{strings.operator.customer}</dt>
            <dd className="text-right font-medium text-zinc-900">{order.user.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-zinc-500">{strings.operator.phone}</dt>
            <dd className="text-right text-zinc-900">{order.user.phone}</dd>
          </div>
          {order.user.email && (
            <div className="flex justify-between gap-3">
              <dt className="text-zinc-500">{strings.operator.email}</dt>
              <dd className="text-right text-zinc-900">{order.user.email}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">
          {strings.operator.items}
        </h2>
        <ul className="flex flex-col divide-y divide-zinc-100" role="list">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex-1 text-sm text-zinc-700">
                {item.product.name}
                <span className="ml-1 text-zinc-400">×{item.quantity}</span>
              </span>
              <Price
                amount={item.unitPrice * item.quantity}
                className="text-sm text-zinc-900"
              />
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
          <span className="text-sm font-semibold text-zinc-900">
            {strings.operator.total}
          </span>
          <Price amount={order.total} className="text-lg text-zinc-900" />
        </div>
      </div>

      {isCompleted ? (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
          {strings.operator.alreadyCompleted}
        </p>
      ) : (
        <CompleteOrderButton orderId={order.id} code={order.code} />
      )}
    </div>
  );
}
