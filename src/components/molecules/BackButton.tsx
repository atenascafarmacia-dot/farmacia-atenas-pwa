"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { strings } from "@/lib/strings";

/** Navigates back in history. Client-only (uses the router). */
export function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label={strings.common.back}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-card text-ink transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      <ArrowLeft size={20} aria-hidden="true" />
    </button>
  );
}
