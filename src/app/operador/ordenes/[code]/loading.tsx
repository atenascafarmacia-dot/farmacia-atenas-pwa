import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <section
      className="flex flex-col gap-4 px-4 pb-6 pt-4"
      aria-busy="true"
      aria-label="Cargando pedido"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-6 w-44" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </section>
  );
}
