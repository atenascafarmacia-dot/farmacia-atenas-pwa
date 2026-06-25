import {
  type CategoryDto,
  categoryRepository,
  type CategoryWithCountDto,
} from "@/repositories/category.repo";
import type { CategoryInput } from "@/schemas/category.schema";

export type { CategoryDto, CategoryWithCountDto };

/** Outcome of a category write: ok, or a known reason the UI can map to a message. */
export type CategoryWriteResult =
  | { ok: true; data: CategoryDto }
  | { ok: false; reason: "DUPLICATE" | "UNKNOWN" };

export type CategoryDeleteResult =
  | { ok: true }
  | { ok: false; reason: "IN_USE" | "UNKNOWN" };

/** Detects Prisma's unique-constraint violation (duplicate category name). */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "P2002"
  );
}

export async function getCategoriesForManagement(): Promise<CategoryWithCountDto[]> {
  return categoryRepository.findAllWithCounts();
}

export async function getCategoryForManagement(id: string): Promise<CategoryDto | null> {
  return categoryRepository.findById(id);
}

export async function createCategory(input: CategoryInput): Promise<CategoryWriteResult> {
  try {
    const data = await categoryRepository.create(input.name);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, reason: isUniqueViolation(error) ? "DUPLICATE" : "UNKNOWN" };
  }
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<CategoryWriteResult> {
  try {
    const data = await categoryRepository.update(id, input.name);
    return { ok: true, data };
  } catch (error) {
    return { ok: false, reason: isUniqueViolation(error) ? "DUPLICATE" : "UNKNOWN" };
  }
}

/**
 * Deletes a category. Blocked while any product still references it (the FK is
 * required), so the operator must reassign those products first.
 */
export async function deleteCategory(id: string): Promise<CategoryDeleteResult> {
  const productCount = await categoryRepository.countProducts(id);
  if (productCount > 0) return { ok: false, reason: "IN_USE" };

  try {
    await categoryRepository.delete(id);
    return { ok: true };
  } catch {
    return { ok: false, reason: "UNKNOWN" };
  }
}
