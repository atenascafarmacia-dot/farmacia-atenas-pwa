import { strings } from "@/lib/strings";

interface QRViewProps {
  code: string;
  qrDataUrl: string;
}

/**
 * Receipt hero: a large scannable QR plus the order code as selectable text,
 * so it can be read aloud or copied at the counter.
 */
export function QRView({ code, qrDataUrl }: QRViewProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
      {/* Data URL image: a plain <img> is correct here (no remote optimization). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={qrDataUrl}
        alt={strings.orders.receipt.qrAlt}
        width={256}
        height={256}
        className="h-64 w-64"
      />

      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          {strings.orders.receipt.orderCode}
        </span>
        <span className="select-all font-mono text-2xl font-bold tracking-widest text-zinc-900">
          {code}
        </span>
      </div>
    </div>
  );
}
