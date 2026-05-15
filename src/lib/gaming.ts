import { gamingGames } from "@/config/gaming-games";

export function getGameSlugs(): string[] {
  return gamingGames.map((g) => g.slug);
}

export function getGameBySlug(slug: string) {
  return gamingGames.find((g) => g.slug === slug) ?? null;
}
