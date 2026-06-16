import {
  type ProductDto,
  type ProductFilters,
  productRepository,
  type ProductWriteData,
} from "@/repositories/product.repo";
import type { ProductInput } from "@/schemas/product.schema";

export type { ProductFilters };

export async function getProducts(filters: ProductFilters = {}) {
  return productRepository.findAll(filters);
}

export async function getCategories(): Promise<string[]> {
  return productRepository.findCategories();
}

export async function getProductById(id: string) {
  return productRepository.findById(id);
}

// ---- Management ----

export async function getProductsForManagement(): Promise<ProductDto[]> {
  return productRepository.findAllForManagement();
}

export async function getProductForManagement(id: string): Promise<ProductDto | null> {
  return productRepository.findByIdForManagement(id);
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
    category: input.category,
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
