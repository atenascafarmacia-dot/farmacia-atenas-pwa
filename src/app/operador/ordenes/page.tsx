import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { OrderPagination } from "@/components/molecules/OrderPagination";
import { OrderList } from "@/components/organisms/OrderList";
import { OrderStatusFilter } from "@/components/organisms/OrderStatusFilter";
import { strings } from "@/lib/strings";
import { listOrders } from "@/services/order.service";

export const metadata: Metadata = {
  title: "Farmacia — Pedidos",
};

type SearchParams = Promise<{
  status?: string | string[];
  q?: string | string[];
  page?: string | string[];
}>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OperatorOrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const { items, total, page, pageSize } = await listOrders({
    status: first(sp.status),
    q: first(sp.q),
    page: first(sp.page),
  });

  // The active chip is derived from the (validated) status param.
  const status = first(sp.status);

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <Link
          href="/operador"
          aria-label={strings.operator.title}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink">{strings.operator.orders.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{strings.operator.orders.subtitle}</p>
        </div>
      </header>

      <OrderStatusFilter active={activeStatusFor(status)} />

      <OrderList orders={items} />

      <OrderPagination page={page} pageSize={pageSize} total={total} />
    </section>
  );
}

/** Narrows a raw status param to a valid OrderStatus for the active chip. */
function activeStatusFor(status: string | undefined) {
  const valid = ["PENDIENTE", "PROCESANDO", "COMPLETADA", "CANCELADA"] as const;
  return valid.find((s) => s === status);
}
