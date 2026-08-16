import { BatchError, batchRepository, type ProductBatchDto } from "@/repositories/batch.repo";
import { type CategoryDto, categoryRepository } from "@/repositories/category.repo";
import {
  type ProductDto,
  type ProductFilters,
  productRepository,
  type ProductWriteData,
} from "@/repositories/product.repo";
import type { BatchInput } from "@/schemas/batch.schema";
import type { ProductInput } from "@/schemas/product.schema";

export type { ProductFilters };

export async function getProducts(filters: ProductFilters = {}) {
  return productRepository.findAll(filters);
}

export async function getCategories(): Promise<CategoryDto[]> {
  return categoryRepository.findAll();
}

export async function getProductById(id: string) {
  return productRepository.findById(id);
}

/**
 * Live stock per active product id. The cart lives only in the client, so the
 * cart/checkout pages fetch this map and match it against the stored items.
 */
export async function getStockMap(): Promise<Record<string, number>> {
  const levels = await productRepository.findStockLevels();
  return Object.fromEntries(levels.map((l) => [l.id, l.stock]));
}

// ---- Management ----

export async function getProductsForManagement(): Promise<ProductDto[]> {
  return productRepository.findAllForManagement();
}

export async function getProductForManagement(id: string): Promise<ProductDto | null> {
  return productRepository.findByIdForManagement(id);
}

// ---- Product batches (lots) ----

export async function getProductBatches(productId: string): Promise<ProductBatchDto[]> {
  return batchRepository.findByProduct(productId);
}

export type AddBatchResult = { ok: true } | { ok: false; reason: "DUPLICATE_LOT" };

export async function addProductBatch(
  productId: string,
  input: BatchInput,
): Promise<AddBatchResult> {
  try {
    await batchRepository.createWithStockEntry(productId, {
      lotNumber: input.lotNumber,
      expiresAt: input.expiresAt ?? null,
      stock: input.stock,
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof BatchError && error.code === "DUPLICATE_LOT") {
      return { ok: false, reason: "DUPLICATE_LOT" };
    }
    throw error;
  }
}

export async function removeProductBatch(id: string, productId: string): Promise<void> {
  return batchRepository.deleteWithStockRemoval(id, productId);
}

/** Normalizes validated form input into persistable data (empty → null). */
function toWriteData(input: ProductInput): ProductWriteData {
  const description = input.description?.trim();
  const imageUrl = input.imageUrl?.trim();
  return {
    name: input.name,
    description: description ? description : null,
    price: input.price,
    stock: input.stock,
    categoryId: input.categoryId,
    expirationDate: input.expirationDate ?? null,
    imageUrl: imageUrl ? imageUrl : null,
    requiresPrescription: input.requiresPrescription,
  };
}

export async function createProduct(input: ProductInput): Promise<ProductDto> {
  return productRepository.create(toWriteData(input));
}

export async function updateProduct(id: string, input: ProductInput): Promise<ProductDto> {
  return productRepository.update(id, toWriteData(input));
}

/**
 * Deletes a product. Defaults to soft-delete (isActive=false) to preserve the
 * order history; only removes the row physically when no order references it.
 */
export async function deleteProduct(id: string): Promise<{ mode: "soft" | "hard" }> {
  const referencingOrders = await productRepository.countOrderItems(id);
  if (referencingOrders === 0) {
    await productRepository.hardDelete(id);
    return { mode: "hard" };
  }
  await productRepository.softDelete(id);
  return { mode: "soft" };
}
