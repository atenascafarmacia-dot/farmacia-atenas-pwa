import { Hourglass, PackageX, ScanSearch } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/molecules/EmptyState";
import { OperatorOrderPanel } from "@/components/organisms/OperatorOrderPanel";
import { OperatorSearch } from "@/components/organisms/OperatorSearch";
import { rateLimit } from "@/lib/rate-limit";
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
  if (!user || !isOperator(user)) notFound();

  const { code } = await searchParams;
  // The QR encodes ?code=..., so we read it straight from the URL.
  const rawCode = typeof code === "string" ? code.trim() : "";

  // Throttle lookups per operator session to curb code brute-forcing.
  const limited =
    rawCode.length > 0 &&
    !rateLimit(`operator-search:${user.id}`, 20, 10_000).allowed;
  const order = rawCode && !limited ? await getOrderByCode(rawCode) : null;

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header>
        <h1 className="text-xl font-bold text-ink">{strings.operator.title}</h1>
        <p className="mt-1 text-sm text-muted">{strings.operator.subtitle}</p>
      </header>

      <OperatorSearch initialCode={rawCode} />

      {!rawCode && (
        <EmptyState
          icon={<ScanSearch className="h-7 w-7" strokeWidth={1.5} />}
          title={strings.operator.emptyTitle}
          message={strings.operator.emptyMessage}
        />
      )}

      {limited && (
        <div role="alert">
          <EmptyState
            icon={<Hourglass className="h-7 w-7" strokeWidth={1.5} />}
            title={strings.operator.rateLimitedTitle}
            message={strings.operator.rateLimitedMessage}
          />
        </div>
      )}

      {rawCode && !limited && !order && (
        <div role="alert">
          <EmptyState
            icon={<PackageX className="h-7 w-7" strokeWidth={1.5} />}
            title={strings.operator.notFoundTitle}
            message={strings.operator.notFound}
          />
        </div>
      )}

      {order && <OperatorOrderPanel order={order} />}
    </section>
  );
}
