"use client";

import { usePathname, useRouter } from "next/navigation";
import { startTransition, useCallback, useState } from "react";

import { SearchBar } from "@/components/molecules/SearchBar";

interface CatalogSearchProps {
  categories: string[];
  initialSearch: string;
  initialCategory: string;
}

export function CatalogSearch({
  categories,
  initialSearch,
  initialCategory,
}: CatalogSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const buildUrl = useCallback(
    (q: string, category: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category) params.set("category", category);
      return params.size ? `${pathname}?${params.toString()}` : pathname;
    },
    [pathname],
  );

  const handleSearch = useCallback(
    (q: string) => {
      startTransition(() => {
        router.replace(buildUrl(q, activeCategory), { scroll: false });
      });
    },
    [router, buildUrl, activeCategory],
  );

  const handleCategory = (category: string) => {
    const next = activeCategory === category ? "" : category;
    setActiveCategory(next);
    startTransition(() => {
      router.replace(buildUrl(initialSearch, next), { scroll: false });
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <SearchBar
        key={initialSearch}
        defaultValue={initialSearch}
        onSearch={handleSearch}
        placeholder="Buscar medicamento..."
      />

      {categories.length > 0 && (
        <nav aria-label="Filtrar por categoría">
          <ul className="flex gap-2 overflow-x-auto overflow-y-hidden pb-1" role="list">
            <li>
              <button
                onClick={() => handleCategory("")}
                aria-pressed={activeCategory === ""}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                  activeCategory === ""
                    ? "bg-green-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Todos
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => handleCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
                    activeCategory === cat
                      ? "bg-green-600 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
