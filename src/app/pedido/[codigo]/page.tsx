import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Price } from "@/components/atoms/Price";
import { QRView } from "@/components/organisms/QRView";
import { createOrderQr } from "@/lib/code";
import { strings } from "@/lib/strings";
import { getOrderByCode } from "@/services/order.service";

type Params = Promise<{ codigo: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { codigo } = await params;
  return {
    title: `Farmacia — Pedido ${codigo}`,
  };
}

export default async function PedidoPage({ params }: { params: Params }) {
  const { codigo } = await params;

  const order = await getOrderByCode(codigo);
  if (!order) notFound();

  const qrDataUrl = await createOrderQr(order.code);

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <p className="text-center text-base font-semibold text-ink">
        {strings.orders.receipt.showAtCounter}
      </p>

      <QRView code={order.code} qrDataUrl={qrDataUrl} />

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <h2 className="mb-3 text-sm font-semibold text-ink">
          {strings.orders.receipt.summary}
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

        <dl className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.delivery}</dt>
            <dd className="text-right text-ink">
              {strings.orders.deliveryLabel[order.deliveryMethod]}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">{strings.operator.payment.method}</dt>
            <dd className="text-right text-ink">
              {strings.orders.paymentMethodLabel[order.paymentMethod]} ·{" "}
              {strings.orders.paymentStatusLabel[order.paymentStatus]}
            </dd>
          </div>
        </dl>

        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm font-semibold text-ink">
            {strings.orders.receipt.total}
          </span>
          <Price amount={order.total} className="text-lg font-bold text-primary-700" />
        </div>
      </div>

      <Link
        href="/catalogo"
        className="flex min-h-[44px] items-center justify-center rounded-xl border border-border text-sm font-medium text-ink transition-colors hover:bg-primary-50"
      >
        {strings.orders.receipt.backToCatalog}
      </Link>
    </section>
  );
}
