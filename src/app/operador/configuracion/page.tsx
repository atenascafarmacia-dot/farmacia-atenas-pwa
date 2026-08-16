import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BackButton } from "@/components/molecules/BackButton";
import { ExchangeRateForm } from "@/components/organisms/ExchangeRateForm";
import { formatDateTimeEs } from "@/lib/date";
import { formatRate } from "@/lib/money";
import { strings } from "@/lib/strings";
import { getCurrentUser, isOperator } from "@/services/session.service";
import { getExchangeRates } from "@/services/setting.service";

export const metadata: Metadata = {
  title: `${strings.operator.settings.title} — ${strings.brand.name}`,
};

export default async function ConfiguracionPage() {
  const user = await getCurrentUser();
  if (!user || !isOperator(user)) notFound();

  const rates = await getExchangeRates();
  const s = strings.operator.settings;
  const configured = [
    rates?.ves != null ? s.currentRate("Bs", formatRate(rates.ves)) : null,
    rates?.cop != null ? s.currentRate("COP", formatRate(rates.cop)) : null,
  ].filter((line): line is string => line !== null);

  return (
    <section className="flex flex-col gap-5 px-4 pb-6 pt-4">
      <header className="flex items-center gap-3">
        <BackButton />
        <div>
          <h1 className="text-xl font-bold text-ink">{s.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{s.subtitle}</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        {rates && configured.length > 0 ? (
          <div className="mb-4 rounded-xl bg-primary-50 px-4 py-3 text-sm">
            <p className="font-semibold text-ink">
              {s.currentRatesTitle} {configured.join(" · ")}
            </p>
            <p className="mt-0.5 text-xs text-muted">
              {s.lastUpdated(formatDateTimeEs(rates.updatedAt))}
            </p>
          </div>
        ) : (
          <p className="mb-4 rounded-xl bg-warning-bg px-4 py-3 text-sm text-warning">
            {s.noRate}
          </p>
        )}

        <ExchangeRateForm
          currentVesRate={rates?.ves ?? null}
          currentCopRate={rates?.cop ?? null}
        />
      </div>
    </section>
  );
}
