"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { OrderStatus } from "@/generated/prisma/enums";
import { strings } from "@/lib/strings";

const STATUSES = Object.values(OrderStatus);

interface OrderStatusFilterProps {
  /** Currently selected status, or undefined for "all". */
  active?: OrderStatus;
}

/** Segmented status chips that drive the `?status=` query param (no reload). */
export function OrderStatusFilter({ active }: OrderStatusFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function select(status?: OrderStatus) {
    const next = new URLSearchParams(searchParams);
    if (status) next.set("status", status);
    else next.delete("status");
    // Changing the filter resets pagination to the first page.
    next.delete("page");
    const query = next.toString();
    startTransition(() => router.push(query ? `${pathname}?${query}` : pathname, { scroll: false }));
  }

  function chip(label: string, status: OrderStatus | undefined, isActive: boolean) {
    return (
      <button
        key={label}
        type="button"
        aria-pressed={isActive}
        disabled={isPending}
        onClick={() => select(status)}
        className={`min-h-[44px] shrink-0 rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-60 ${
          isActive
            ? "border-primary-600 bg-primary-600 text-white"
            : "border-border bg-card text-muted hover:bg-primary-50 hover:text-primary-700"
        }`}
      >
        {label}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={strings.operator.orders.title}
      className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {chip(strings.operator.orders.filterAll, undefined, !active)}
      {STATUSES.map((status) =>
        chip(strings.orders.statusLabel[status], status, active === status),
      )}
    </div>
  );
}
