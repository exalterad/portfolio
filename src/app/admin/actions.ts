"use server";

import { revalidatePath } from "next/cache";

import { isAdminFromSession } from "@/lib/admin-auth";
import { aboutContentSchema, type PortfolioAboutContent } from "@/lib/about-schema";
import { persistAbout } from "@/lib/about-store";
import { projectArraySchema, type PortfolioProject } from "@/lib/project-schema";
import { getDisplayProjects, persistProjects } from "@/lib/project-store";

export type SaveProjectsResult = { ok: true } | { ok: false; error: string };
export type SaveAboutResult = SaveProjectsResult;

export async function saveProjectsAction(data: unknown): Promise<SaveProjectsResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let projects: PortfolioProject[];
  try {
    projects = projectArraySchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  const slugs = projects.map((p) => p.slug);
  if (new Set(slugs).size !== slugs.length) {
    return { ok: false, error: "Alla slug-värden måste vara unika." };
  }

  try {
    await persistProjects(projects);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/projekt", "layout");
  return { ok: true };
}

export async function deleteProjectBySlugAction(slug: string): Promise<SaveProjectsResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  const s = slug.trim().toLowerCase();
  if (!s) return { ok: false, error: "Ogiltig slug." };

  const projects = await getDisplayProjects();
  const next = projects.filter((p) => p.slug !== s);
  if (next.length === projects.length) {
    return { ok: false, error: "Projektet hittades inte." };
  }

  try {
    await persistProjects(next);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte ta bort.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/projekt", "layout");
  return { ok: true };
}

export async function saveAboutAction(data: unknown): Promise<SaveAboutResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let content: PortfolioAboutContent;
  try {
    content = aboutContentSchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  if (!content.sectionTitle.before.trim() && !content.sectionTitle.accent.trim()) {
    return { ok: false, error: "Huvudrubriken kan inte vara tom." };
  }

  try {
    await persistAbout(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/om-mig/redigera");
  return { ok: true };
}
