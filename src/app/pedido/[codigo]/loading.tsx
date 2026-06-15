import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <section
      className="flex flex-col items-center gap-5 px-4 pb-6 pt-4"
      aria-busy="true"
      aria-label="Cargando pedido"
    >
      <Skeleton className="h-5 w-56" />
      <Skeleton className="h-80 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </section>
  );
}
