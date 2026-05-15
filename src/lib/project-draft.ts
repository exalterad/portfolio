import type { PortfolioProject } from "@/lib/project-schema";

/** Skapar ett tomt utkast med giltiga standardvärden för formulär/wizard. */
export function createEmptyProject(): PortfolioProject {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : String(Date.now());
  return {
    slug: `nytt-projekt-${id}`,
    title: "",
    summary: "",
    tags: [],
    year: "",
    image: "https://picsum.photos/seed/adminnew/1200/720",
    imageAlt: "",
    paragraphs: [""],
    links: { live: "", repo: "" },
  };
}

/** Enkel slug från titel (små bokstäver, bindestreck). */
export function slugifyFromTitle(raw: string): string {
  const s = raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || `projekt-${Date.now()}`;
}
