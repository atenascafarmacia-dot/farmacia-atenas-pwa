import { Price } from "@/components/atoms/Price";
import { CompleteOrderButton } from "@/components/molecules/CompleteOrderButton";
import { MarkOrderPaidButton } from "@/components/molecules/MarkOrderPaidButton";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import { strings } from "@/lib/strings";
import type { OrderDetailDto } from "@/repositories/order.repo";

interface OperatorOrderPanelProps {
  order: OrderDetailDto;
}

/** Read-only order detail for the operator, plus the complete-order action. */
export function OperatorOrderPanel({ order }: OperatorOrderPanelProps) {
  const isCompleted = order.status === "COMPLETADA";
  const isCancelled = order.status === "CANCELADA";
  // Completed/cancelled orders are closed: no "complete" CTA.
  const isClosed = isCompleted || isCancelled;
  const isDelivery = order.deliveryMethod === "ENVIO_DOMICILIO";
  const isPaid = order.paymentStatus === "PAGADO";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-soft">
        <span className="font-mono text-lg font-bold tracking-widest text-ink">
          {order.code}
        </span>
        <OrderStatusBadge status={order.status} />
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
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          {strings.operator.payment.section}
        </h2>
        <dl className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.delivery}</dt>
            <dd className="text-right font-medium text-ink">
              {strings.orders.deliveryLabel[order.deliveryMethod]}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.payment.method}</dt>
            <dd className="text-right text-ink">
              {strings.orders.paymentMethodLabel[order.paymentMethod]}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.payment.status}</dt>
            <dd
              className={`text-right font-medium ${isPaid ? "text-success" : "text-danger"}`}
            >
              {strings.orders.paymentStatusLabel[order.paymentStatus]}
            </dd>
          </div>
        </dl>
      </div>

      {isDelivery && order.shippingAddress && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {strings.operator.shipping}
          </h2>
          <p className="text-sm text-ink">
            {order.shippingAddress}
            <br />
            {order.shippingCity}, {order.shippingState}
            {order.shippingZip ? ` (${order.shippingZip})` : ""}
          </p>
        </div>
      )}

      {order.notes && (
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {strings.operator.notes}
          </h2>
          <p className="text-sm text-ink">{order.notes}</p>
        </div>
      )}

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

      {!isPaid && !isCancelled && (
        <MarkOrderPaidButton orderId={order.id} code={order.code} />
      )}

      {isClosed ? (
        <p
          className={`rounded-xl px-4 py-3 text-center text-sm font-medium ${
            isCancelled ? "bg-danger-bg text-danger" : "bg-success-bg text-success"
          }`}
        >
          {isCancelled ? strings.operator.orders.cancelledNote : strings.operator.alreadyCompleted}
        </p>
      ) : (
        <CompleteOrderButton orderId={order.id} code={order.code} />
      )}
    </div>
  );
}
