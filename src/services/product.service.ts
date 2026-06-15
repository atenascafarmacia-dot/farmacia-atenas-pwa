import { type ProductFilters,productRepository } from "@/repositories/product.repo";

export type { ProductFilters };

export async function getProducts(filters: ProductFilters = {}) {
  return productRepository.findAll(filters);
}

export async function getCategories(): Promise<string[]> {
  return productRepository.findCategories();
}
