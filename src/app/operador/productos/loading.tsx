import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <section
      className="flex flex-col gap-4 px-4 pb-6 pt-4"
      aria-busy="true"
      aria-label="Cargando productos"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-11 w-40 rounded-full" />
      <ul className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </li>
        ))}
      </ul>
    </section>
  );
}
