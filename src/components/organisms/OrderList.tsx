import { ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";

import { Price } from "@/components/atoms/Price";
import { EmptyState } from "@/components/molecules/EmptyState";
import { OrderStatusBadge } from "@/components/molecules/OrderStatusBadge";
import { strings } from "@/lib/strings";
import type { OrderListItemDto } from "@/repositories/order.repo";

const dateFormatter = new Intl.DateTimeFormat("es", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

interface OrderListProps {
  orders: OrderListItemDto[];
}

/** Operator order list: tappable rows linking to each order's detail. */
export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Inbox className="h-7 w-7" strokeWidth={1.5} />}
        title={strings.operator.orders.empty}
        message={strings.operator.orders.emptyHint}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2.5" role="list">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/operador/ordenes/${order.code}`}
            className="flex min-h-[44px] items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-widest text-ink">
                  {order.code}
                </span>
                <OrderStatusBadge status={order.status} />
              </div>
              <span className="truncate text-sm text-ink">{order.customerName}</span>
              <span className="text-xs text-muted">
                {dateFormatter.format(order.createdAt)} ·{" "}
                {strings.operator.orders.itemsCount(order.itemsCount)}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Price amount={order.total} className="text-sm text-primary-700" />
              <ChevronRight size={18} className="text-muted" aria-hidden="true" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
