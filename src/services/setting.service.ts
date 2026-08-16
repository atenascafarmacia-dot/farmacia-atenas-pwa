import { settingRepository } from "@/repositories/setting.repo";
import type { ExchangeRateInput } from "@/schemas/setting.schema";

export type ExchangeRatesDto = {
  /** Bs per USD, or null when not configured. */
  ves: number | null;
  /** COP per USD, or null when not configured. */
  cop: number | null;
  updatedAt: Date;
};

/** The configured per-USD rates, or null when none have been set yet. */
export async function getExchangeRates(): Promise<ExchangeRatesDto | null> {
  const setting = await settingRepository.get();
  if (!setting) return null;
  return { ves: setting.usdVesRate, cop: setting.usdCopRate, updatedAt: setting.updatedAt };
}

export async function setExchangeRates(input: ExchangeRateInput): Promise<ExchangeRatesDto> {
  const setting = await settingRepository.upsertRates({
    usdVesRate: input.vesRate ?? null,
    usdCopRate: input.copRate ?? null,
  });
  return { ves: setting.usdVesRate, cop: setting.usdCopRate, updatedAt: setting.updatedAt };
}
