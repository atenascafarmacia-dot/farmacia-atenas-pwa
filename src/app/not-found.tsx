import { Compass } from "lucide-react";
import Link from "next/link";

import { strings } from "@/lib/strings";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100svh-56px)] flex-col items-center justify-center gap-5 px-6 text-center">
      <span
        aria-hidden="true"
        className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-primary-600"
      >
        <Compass className="h-9 w-9" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-900">
          {strings.common.notFound.title}
        </h1>
        <p className="text-sm text-zinc-500">{strings.common.notFound.message}</p>
      </div>
      <Link
        href="/catalogo"
        className="flex min-h-[44px] items-center justify-center rounded-xl bg-green-600 px-6 text-sm font-medium text-white transition-colors hover:bg-green-700"
      >
        {strings.common.goCatalog}
      </Link>
    </div>
  );
}
