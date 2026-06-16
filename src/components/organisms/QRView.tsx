import { Wordmark } from "@/components/atoms/Wordmark";
import { strings } from "@/lib/strings";

interface QRViewProps {
  code: string;
  qrDataUrl: string;
}

/**
 * Branded pickup card: the wordmark, a large scannable QR, and the order code
 * as selectable text so it can be read aloud or copied at the counter.
 */
export function QRView({ code, qrDataUrl }: QRViewProps) {
  return (
    <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
      <Wordmark />

      <div className="rounded-2xl border border-border bg-surface p-3">
        {/* Data URL image: a plain <img> is correct here (no remote optimization). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt={strings.orders.receipt.qrAlt}
          width={256}
          height={256}
          className="h-64 w-64"
        />
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">
          {strings.orders.receipt.orderCode}
        </span>
        <span className="select-all font-mono text-2xl font-bold tracking-widest text-ink">
          {code}
        </span>
      </div>
    </div>
  );
}
