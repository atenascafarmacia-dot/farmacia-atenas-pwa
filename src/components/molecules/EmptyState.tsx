import { Inbox } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  /** A line icon node (e.g. a lucide icon). Defaults to an inbox. */
  icon?: ReactNode;
  title: string;
  message?: string;
  /** Optional call to action (e.g. a Link wrapping a Button). */
  action?: ReactNode;
  className?: string;
}

/** Reusable empty/placeholder state with a branded icon and optional CTA. */
export function EmptyState({
  icon,
  title,
  message,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600"
      >
        {icon ?? <Inbox className="h-7 w-7" strokeWidth={1.5} />}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-ink">{title}</p>
        {message && <p className="text-sm text-muted">{message}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
