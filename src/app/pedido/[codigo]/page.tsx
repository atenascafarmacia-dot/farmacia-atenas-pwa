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
      <p className="text-center text-base font-semibold text-zinc-900">
        {strings.orders.receipt.showAtCounter}
      </p>

      <QRView code={order.code} qrDataUrl={qrDataUrl} />

      <div className="rounded-2xl border border-zinc-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">
          {strings.orders.receipt.summary}
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
            {strings.orders.receipt.total}
          </span>
          <Price amount={order.total} className="text-lg text-zinc-900" />
        </div>
      </div>

      <Link
        href="/catalogo"
        className="flex min-h-[44px] items-center justify-center rounded-xl border border-zinc-300 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
      >
        {strings.orders.receipt.backToCatalog}
      </Link>
    </section>
  );
}
