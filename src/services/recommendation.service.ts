import { type ProductDto, productRepository } from "@/repositories/product.repo";
import { recommendationRepository } from "@/repositories/recommendation.repo";

/**
 * Strategy pattern: a recommendation source resolves a ranked list of products.
 * Concrete strategies differ only in how the ranking is computed.
 */
export interface RecommendationStrategy {
  readonly name: string;
  recommend(limit: number): Promise<ProductDto[]>;
}

/** Products the given user buys most often. */
class FrequentByUserStrategy implements RecommendationStrategy {
  readonly name = "frequent-by-user";

  constructor(private readonly userId: string) {}

  async recommend(limit: number): Promise<ProductDto[]> {
    const ids = await recommendationRepository.topProductIdsByUser(this.userId, limit);
    return productRepository.findByIds(ids);
  }
}

/** Global best-sellers; used as a fallback when there's no user history. */
class TopSellersStrategy implements RecommendationStrategy {
  readonly name = "top-sellers";

  async recommend(limit: number): Promise<ProductDto[]> {
    const ids = await recommendationRepository.topProductIdsGlobal(limit);
    return productRepository.findByIds(ids);
  }
}

/** Picks the personalized strategy when the user has history, else the fallback. */
async function selectStrategy(userId: string | null): Promise<RecommendationStrategy> {
  if (userId && (await recommendationRepository.userHasHistory(userId))) {
    return new FrequentByUserStrategy(userId);
  }
  return new TopSellersStrategy();
}

/** Returns recommended products for the user via the chosen strategy. */
export async function getRecommendations(
  userId: string | null,
  limit = 6,
): Promise<ProductDto[]> {
  const strategy = await selectStrategy(userId);
  return strategy.recommend(limit);
}
