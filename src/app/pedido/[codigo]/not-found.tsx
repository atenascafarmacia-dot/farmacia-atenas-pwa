import Link from "next/link";

import { strings } from "@/lib/strings";

export default function PedidoNotFound() {
  return (
    <section className="flex flex-col items-center gap-4 px-4 pb-6 pt-16 text-center">
      <h1 className="text-xl font-bold text-ink">
        {strings.orders.receipt.notFoundTitle}
      </h1>
      <p className="text-sm text-muted">
        {strings.orders.receipt.notFoundMessage}
      </p>
      <Link
        href="/catalogo"
        className="flex min-h-[44px] items-center justify-center rounded-xl bg-primary-600 px-6 text-sm font-medium text-white transition-colors hover:bg-primary-700"
      >
        {strings.orders.receipt.backToCatalog}
      </Link>
    </section>
  );
}
