import type { PortfolioProject } from "@/lib/project-schema";
import { getDisplayProjects } from "@/lib/project-store";

export type { PortfolioProject } from "@/lib/project-schema";
export { getDisplayProjects } from "@/lib/project-store";

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | undefined> {
  const all = await getDisplayProjects();
  return all.find((p) => p.slug === slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  const all = await getDisplayProjects();
  return all.map((p) => p.slug);
}
