/** Formaterar Steam `playtime_forever` (minuter) till svensk visning. */
export function formatSteamPlaytime(playtimeMinutes: number): string {
  const h = Math.floor(playtimeMinutes / 60);
  if (h < 1) return "Under 1 timme";
  return `${h.toLocaleString("sv-SE")} timmar`;
}

export function steamHeaderImageUrl(appId: number): string {
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
}

export function steamStoreUrl(appId: number): string {
  return `https://store.steampowered.com/app/${appId}`;
}

export function slugifySteamTitle(name: string, appId: number): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base.length > 0 ? base : `steam-${appId}`;
}

export function uniqueSteamSlug(base: string, appId: number, reserved: Set<string>): string {
  if (!reserved.has(base)) return base;
  const withId = `${base}-${appId}`;
  if (!reserved.has(withId)) return withId;
  return `steam-${appId}`;
}
