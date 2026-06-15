import type { ReactNode } from "react";

interface EmptyStateProps {
  /** Emoji string or an icon node. */
  icon?: ReactNode;
  title: string;
  message?: string;
  /** Optional call to action (e.g. a Link wrapping a Button). */
  action?: ReactNode;
  className?: string;
}

/** Reusable empty/placeholder state with an optional CTA. */
export function EmptyState({
  icon = "📭",
  title,
  message,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-16 text-center ${className}`}
    >
      {icon && (
        <span aria-hidden="true" className="text-5xl">
          {icon}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-base font-semibold text-zinc-800">{title}</p>
        {message && <p className="text-sm text-zinc-500">{message}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
