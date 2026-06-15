import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OperatorOrderPanel } from "@/components/organisms/OperatorOrderPanel";
import { OperatorSearch } from "@/components/organisms/OperatorSearch";
import { strings } from "@/lib/strings";
import { getOrderByCode } from "@/services/order.service";
import { getCurrentUser, isOperator } from "@/services/session.service";

export const metadata: Metadata = {
  title: "Farmacia — Operador",
};

type SearchParams = Promise<{ code?: string | string[] }>;

export default async function OperadorPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Only the configured operator (matched by OPERATOR_PHONE) may see this view.
  const user = await getCurrentUser();
  if (!isOperator(user)) notFound();

  const { code } = await searchParams;
  // The QR encodes ?code=..., so we read it straight from the URL.
  const rawCode = typeof code === "string" ? code.trim() : "";
  const order = rawCode ? await getOrderByCode(rawCode) : null;

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header>
        <h1 className="text-xl font-bold text-zinc-900">{strings.operator.title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{strings.operator.subtitle}</p>
      </header>

      <OperatorSearch initialCode={rawCode} />

      {rawCode && !order && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700"
        >
          {strings.operator.notFound}
        </p>
      )}

      {order && <OperatorOrderPanel order={order} />}
    </section>
  );
}
