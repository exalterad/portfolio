import { cache } from "react";

import { getDisplayGaming } from "@/lib/gaming-store";
import type { GamingGame, PortfolioGamingContent } from "@/lib/gaming-schema";
import { getSteamSyncedLibraryGames } from "@/lib/steam-library";

export type { GamingGame, GamingSettingsSection, PortfolioGamingContent } from "@/lib/gaming-schema";
export { getDisplayGaming, getStaticGaming, isGamingStorageConfigured } from "@/lib/gaming-store";

export const getGamingContent = cache(async (): Promise<PortfolioGamingContent> => getDisplayGaming());

export async function getConfiguredGames(): Promise<GamingGame[]> {
  const { games } = await getGamingContent();
  return games;
}

export async function getGameBySlug(slug: string): Promise<GamingGame | null> {
  const games = await getConfiguredGames();
  return games.find((g) => g.slug === slug) ?? null;
}

/** Manuellt konfigurerade + Steam-syncade spel (för routing och listor). */
export const resolveGameBySlug = cache(async (slug: string): Promise<GamingGame | null> => {
  const manual = await getGameBySlug(slug);
  if (manual) return manual;
  const steam = await getSteamSyncedLibraryGames();
  return steam.find((g) => g.slug === slug) ?? null;
});

export const getAllResolvableSlugs = cache(async (): Promise<string[]> => {
  const [games, steam] = await Promise.all([getConfiguredGames(), getSteamSyncedLibraryGames()]);
  return [...games.map((g) => g.slug), ...steam.map((g) => g.slug)];
});

export async function getMainGame(): Promise<GamingGame> {
  const { layout, games } = await getGamingContent();
  const game = games.find((g) => g.slug === layout.mainGameSlug);
  if (!game) throw new Error(`Huvudspel saknas: ${layout.mainGameSlug}`);
  return game;
}

/** Topp 3 i podiumordning: #2 vänster, #1 mitten, #3 höger. */
export async function getTop3GamesForPodium(): Promise<[GamingGame, GamingGame, GamingGame]> {
  const { layout, games } = await getGamingContent();
  const bySlug = new Map(games.map((g) => [g.slug, g]));
  const first = bySlug.get(layout.top3Slugs[0]!);
  const second = bySlug.get(layout.top3Slugs[1]!);
  const third = bySlug.get(layout.top3Slugs[2]!);
  if (!first || !second || !third) {
    throw new Error("Topp 3-spel saknas i gaming-konfigurationen.");
  }
  return [second, first, third];
}

export async function getFeaturedSlugs(): Promise<Set<string>> {
  const { layout } = await getGamingContent();
  return new Set([layout.mainGameSlug, ...layout.top3Slugs]);
}

async function getManualLibraryGames(): Promise<GamingGame[]> {
  const [{ games }, featured] = await Promise.all([getGamingContent(), getFeaturedSlugs()]);
  return games.filter((g) => !featured.has(g.slug));
}

/** Manuella biblioteksspel + Steam-sync (deduplicerat via app-id). */
export const getLibraryGames = cache(async (): Promise<GamingGame[]> => {
  const manual = await getManualLibraryGames();
  const steam = await getSteamSyncedLibraryGames();
  return [...manual, ...steam];
});

export const getGamingSectionData = cache(async () => {
  const [mainGame, podiumGames, libraryGames] = await Promise.all([
    getMainGame(),
    getTop3GamesForPodium(),
    getLibraryGames(),
  ]);
  return { mainGame, podiumGames, libraryCount: libraryGames.length };
});
