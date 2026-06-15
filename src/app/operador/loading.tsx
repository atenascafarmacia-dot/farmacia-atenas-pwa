import { Skeleton } from "@/components/atoms/Skeleton";

export default function Loading() {
  return (
    <section
      className="flex flex-col gap-5 px-4 pb-6 pt-4"
      aria-busy="true"
      aria-label="Cargando operador"
    >
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-28" />
        <Skeleton className="h-4 w-52" />
      </div>
      <div className="flex items-end gap-2">
        <Skeleton className="h-[68px] flex-1 rounded-xl" />
        <Skeleton className="h-[44px] w-20 rounded-xl" />
      </div>
      <Skeleton className="h-44 w-full rounded-2xl" />
    </section>
  );
}
