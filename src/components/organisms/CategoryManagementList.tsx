import Link from "next/link";

import { DeleteCategoryButton } from "@/components/molecules/DeleteCategoryButton";
import { strings } from "@/lib/strings";
import type { CategoryWithCountDto } from "@/services/category.service";

interface CategoryManagementListProps {
  categories: CategoryWithCountDto[];
}

/** Management list: every category with its product count, edit and delete. */
export function CategoryManagementList({ categories }: CategoryManagementListProps) {
  return (
    <ul className="flex flex-col gap-2" aria-label={strings.management.categories.title}>
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3 shadow-soft"
        >
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-ink">{category.name}</h2>
            <p className="mt-0.5 text-xs text-muted">
              {strings.management.categories.productCount(category.productCount)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/operador/categorias/${category.id}/editar`}
              className="flex min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              {strings.management.categories.edit}
            </Link>
            <DeleteCategoryButton id={category.id} name={category.name} />
          </div>
        </li>
      ))}
    </ul>
  );
}
