import { Skeleton } from "@/components/atoms/Skeleton";
import { ProductModal } from "@/components/organisms/ProductModal";

/** Streamed skeleton shown inside the modal sheet while the detail loads. */
export default function Loading() {
  return (
    <ProductModal>
      <div
        className="flex flex-col gap-5 px-4 pb-6 pt-4"
        aria-busy="true"
        aria-label="Cargando producto"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <Skeleton className="h-5 w-40" />
        </div>

        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </ProductModal>
  );
}
