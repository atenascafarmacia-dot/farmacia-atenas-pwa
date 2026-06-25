"use client";

import { usePathname, useRouter } from "next/navigation";
import { startTransition, useCallback, useState } from "react";

import { SearchBar } from "@/components/molecules/SearchBar";
import type { CategoryDto } from "@/repositories/category.repo";

interface CatalogSearchProps {
  categories: CategoryDto[];
  initialSearch: string;
  /** Currently active category id (empty = all). */
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
          <ul
            className="-mx-4 flex gap-2 overflow-x-auto overflow-y-hidden px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
          >
            <li>
              <button
                onClick={() => handleCategory("")}
                aria-pressed={activeCategory === ""}
                className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  activeCategory === ""
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-border bg-card text-muted hover:bg-primary-50 hover:text-primary-700"
                }`}
              >
                Todos
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => handleCategory(cat.id)}
                  aria-pressed={activeCategory === cat.id}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                    activeCategory === cat.id
                      ? "border-primary-600 bg-primary-600 text-white"
                      : "border-border bg-card text-muted hover:bg-primary-50 hover:text-primary-700"
                  }`}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
