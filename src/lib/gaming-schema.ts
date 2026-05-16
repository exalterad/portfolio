import { z } from "zod";

export const gamingPreviewImageSchema = z.object({
  image: z.string().min(1),
  alt: z.string(),
  copyCommand: z.string().optional(),
  highlight: z.boolean().optional(),
  highlightLabel: z.string().optional(),
});

export const gamingSettingRowSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const gamingSettingsSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  rows: z.array(gamingSettingRowSchema),
  previewGrid: z.array(gamingPreviewImageSchema).optional(),
});

export const gamingHeroStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const gamingGameSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: små bokstäver, siffror och bindestreck."),
  title: z.string().min(1),
  tagline: z.string(),
  summary: z.string(),
  previewBadge: z.string(),
  image: z.string().min(1),
  imageAlt: z.string(),
  tags: z.array(z.string()),
  steamAppId: z.number().int().positive().optional(),
  playtime: z.string(),
  heroStats: z.array(gamingHeroStatSchema).max(3).optional(),
  settingsSections: z.array(gamingSettingsSectionSchema),
});

export const gamingLayoutSchema = z.object({
  mainGameSlug: z.string().min(1),
  /** Podium: index 0 = #1 (mitten), 1 = #2 (vänster), 2 = #3 (höger). */
  top3Slugs: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
  steamLibrary: z.object({
    enabled: z.boolean(),
    maxGames: z.number().int().min(0).max(50),
    minPlaytimeMinutes: z.number().int().min(0).max(100_000),
  }),
});

export const gamingContentSchema = z.object({
  layout: gamingLayoutSchema,
  games: z.array(gamingGameSchema).min(1),
});

export type GamingPreviewImage = z.infer<typeof gamingPreviewImageSchema>;
export type GamingSettingRow = z.infer<typeof gamingSettingRowSchema>;
export type GamingSettingsSection = z.infer<typeof gamingSettingsSectionSchema>;
export type GamingGame = z.infer<typeof gamingGameSchema>;
export type GamingLayout = z.infer<typeof gamingLayoutSchema>;
export type PortfolioGamingContent = z.infer<typeof gamingContentSchema>;
