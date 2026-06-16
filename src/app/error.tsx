"use client";

import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/atoms/Button";
import { strings } from "@/lib/strings";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error for debugging/observability.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100svh-56px)] flex-col items-center justify-center gap-5 px-6 text-center">
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-bg text-danger"
      >
        <TriangleAlert className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-bold text-zinc-900">{strings.common.errorTitle}</h1>
        <p className="text-sm text-zinc-500">{strings.common.error}</p>
      </div>
      <Button onClick={() => reset()}>{strings.common.retry}</Button>
    </div>
  );
}
