import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <section
      className="flex flex-col gap-5 px-4 pb-6 pt-4"
      aria-busy="true"
      aria-label="Cargando pedidos"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 rounded-full" />
        ))}
      </div>
      <ul className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-20 w-full rounded-2xl" />
          </li>
        ))}
      </ul>
    </section>
  );
}
