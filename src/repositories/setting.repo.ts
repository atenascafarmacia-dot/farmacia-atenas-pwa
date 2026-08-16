import { prisma } from "@/lib/prisma";

const SETTING_ID = "main";

export type SettingDto = {
  usdVesRate: number | null;
  usdCopRate: number | null;
  updatedAt: Date;
};

export type SettingWriteData = {
  usdVesRate: number | null;
  usdCopRate: number | null;
};

const SELECT_SETTING = { usdVesRate: true, usdCopRate: true, updatedAt: true } as const;

export const settingRepository = {
  get: (): Promise<SettingDto | null> =>
    prisma.setting.findUnique({ where: { id: SETTING_ID }, select: SELECT_SETTING }),

  upsertRates: (data: SettingWriteData): Promise<SettingDto> =>
    prisma.setting.upsert({
      where: { id: SETTING_ID },
      create: { id: SETTING_ID, ...data },
      update: data,
      select: SELECT_SETTING,
    }),
};
