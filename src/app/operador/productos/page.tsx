import { Package, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/molecules/EmptyState";
import { ProductManagementList } from "@/components/organisms/ProductManagementList";
import { strings } from "@/lib/strings";
import { getProductsForManagement } from "@/services/product.service";

export const metadata: Metadata = {
  title: `${strings.management.title} — ${strings.brand.name}`,
};

export default async function ProductsManagementPage() {
  const products = await getProductsForManagement();

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <header>
        <h1 className="text-xl font-bold text-ink">{strings.management.title}</h1>
        <p className="mt-1 text-sm text-muted">{strings.management.subtitle}</p>
      </header>

      <Link
        href="/operador/productos/nuevo"
        className="inline-flex min-h-[44px] items-center justify-center gap-1.5 self-start rounded-full bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1"
      >
        <Plus size={16} strokeWidth={2.25} aria-hidden="true" />
        {strings.management.new}
      </Link>

      {products.length === 0 ? (
        <EmptyState
          icon={<Package className="h-7 w-7" strokeWidth={1.5} />}
          title={strings.management.empty}
          message={strings.management.emptyHint}
        />
      ) : (
        <ProductManagementList products={products} />
      )}
    </section>
  );
}
