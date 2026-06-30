import { strings } from "@/lib/strings";

const payment = strings.orders.receipt.payment;

/**
 * Static card listing the pharmacy's payment accounts (transfer, pago móvil,
 * Zelle, Bancolombia) so the customer can pay and bring the proof to the
 * counter. Account values are `select-all` so they can be copied on touch.
 */
export function PaymentMethods() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <h2 className="text-sm font-semibold text-ink">{payment.title}</h2>
      <p className="mt-1 text-xs text-muted">{payment.hint}</p>

      <ul className="mt-3 flex flex-col gap-3" role="list">
        {payment.methods.map((method) => (
          <li
            key={method.name}
            className="rounded-xl border border-border bg-surface p-3"
          >
            <h3 className="text-sm font-semibold text-ink">{method.name}</h3>

            <dl className="mt-2 flex flex-col gap-1 text-sm">
              {method.rows.map((row) => (
                <div key={row.label} className="flex justify-between gap-3">
                  <dt className="text-muted">{row.label}</dt>
                  <dd className="select-all text-right font-medium text-ink">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            {method.notes.length > 0 && (
              <ul
                className="mt-2 flex flex-col gap-1 border-t border-border pt-2 text-xs text-muted"
                role="list"
              >
                {method.notes.map((note) => (
                  <li key={note} className="flex gap-1.5">
                    <span aria-hidden>•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
