import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { CatalogSearch } from "@/components/organisms/CatalogSearch";
import { ProductList } from "@/components/organisms/ProductList";
import { RecommendationsSection } from "@/components/organisms/RecommendationsSection";
import { getCategories, getProducts } from "@/services/product.service";
import { getRecommendations } from "@/services/recommendation.service";
import { getCurrentUser } from "@/services/session.service";

export const metadata: Metadata = {
  title: "Farmacia — Catálogo",
};

type SearchParams = Promise<{
  q?: string | string[];
  category?: string | string[];
}>;

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const { q, category } = await searchParams;

  const search = typeof q === "string" && q.trim() ? q.trim() : undefined;
  const cat = typeof category === "string" && category ? category : undefined;
  const filters = { search, category: cat };

  // Recommendations belong to the default browse view, not to filtered results.
  const showRecommendations = !search && !cat;

  // Fetch everything before rendering — no in-page Suspense needed.
  // The loading.tsx skeleton covers the wait at the route level.
  const [categories, products, recommendations] = await Promise.all([
    getCategories(),
    getProducts(filters),
    showRecommendations ? getRecommendations(user.id) : Promise.resolve([]),
  ]);

  return (
    <section className="flex flex-col gap-4 px-4 pb-6 pt-4">
      <h1 className="text-xl font-bold text-zinc-900">Catálogo</h1>

      {showRecommendations && <RecommendationsSection products={recommendations} />}

      <CatalogSearch
        categories={categories}
        initialSearch={search ?? ""}
        initialCategory={cat ?? ""}
      />

      <ProductList products={products} filters={filters} />
    </section>
  );
}
