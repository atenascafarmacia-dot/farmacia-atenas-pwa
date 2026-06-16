import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusActions } from "@/components/molecules/OrderStatusActions";
import { OperatorOrderPanel } from "@/components/organisms/OperatorOrderPanel";
import { strings } from "@/lib/strings";
import { getOrderDetail } from "@/services/order.service";

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { code } = await params;
  return { title: `Farmacia — Pedido ${decodeURIComponent(code)}` };
}

export default async function OperatorOrderDetailPage({ params }: { params: Params }) {
  const { code } = await params;
  const order = await getOrderDetail(decodeURIComponent(code));
  if (!order) notFound();

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <Link
          href="/operador/ordenes"
          aria-label={strings.operator.orders.backToList}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-bold text-ink">{strings.operator.orders.detailTitle}</h1>
      </header>

      <OperatorOrderPanel order={order} />

      <OrderStatusActions orderId={order.id} code={order.code} status={order.status} />
    </section>
  );
}
