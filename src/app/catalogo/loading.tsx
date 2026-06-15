import { Skeleton } from "@/components/atoms/Skeleton";
import { ProductCardSkeleton } from "@/components/molecules/ProductCardSkeleton";

export default function Loading() {
  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4" aria-busy="true" aria-label="Cargando catálogo">
      {/* Título */}
      <Skeleton className="h-7 w-24" />

      {/* Barra de búsqueda */}
      <Skeleton className="h-[44px] w-full rounded-xl" />

      {/* Pills de categorías */}
      <div className="flex gap-2 overflow-hidden">
        {[80, 96, 72, 88].map((w) => (
          <Skeleton key={w} className={`h-8 w-${w / 4} flex-shrink-0 rounded-full`} />
        ))}
      </div>

      {/* Grid de productos */}
      <ul className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <ProductCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}
