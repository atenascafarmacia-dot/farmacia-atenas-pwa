"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { strings } from "@/lib/strings";

interface OrderPaginationProps {
  page: number;
  pageSize: number;
  total: number;
}

/** Simple prev/next pager driven by the `?page=` query param. */
export function OrderPagination({ page, pageSize, total }: OrderPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  function go(nextPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    startTransition(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
  }

  const buttonClass =
    "inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-medium text-ink transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50";

  return (
    <nav className="flex items-center justify-between gap-3" aria-label={strings.operator.orders.title}>
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1 || isPending}
        className={buttonClass}
      >
        <ChevronLeft size={18} aria-hidden="true" />
        {strings.operator.orders.prev}
      </button>
      <span className="text-sm text-muted" aria-live="polite">
        {strings.operator.orders.pageInfo(page, totalPages)}
      </span>
      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages || isPending}
        className={buttonClass}
      >
        {strings.operator.orders.next}
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  );
}
