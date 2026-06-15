import { Skeleton } from "@/components/atoms/Skeleton";

export function ProductCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-white p-4"
    >
      <Skeleton className="aspect-square w-full rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-[44px] w-20 rounded-xl" />
      </div>
    </div>
  );
}
