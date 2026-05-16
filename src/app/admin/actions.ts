"use server";

import { revalidatePath } from "next/cache";

import { isAdminFromSession } from "@/lib/admin-auth";
import { aboutContentSchema, type PortfolioAboutContent } from "@/lib/about-schema";
import { persistAbout } from "@/lib/about-store";
import { experienceContentSchema, type PortfolioExperienceContent } from "@/lib/experience-schema";
import { persistExperience } from "@/lib/experience-store";
import { gamingContentSchema, type PortfolioGamingContent } from "@/lib/gaming-schema";
import { persistGaming } from "@/lib/gaming-store";
import { setupContentSchema, type PortfolioSetupContent } from "@/lib/setup-schema";
import { persistSetup } from "@/lib/setup-store";
import { socialContentSchema, type PortfolioSocialContent } from "@/lib/social-schema";
import { persistSocial } from "@/lib/social-store";
import { skillsContentSchema, type PortfolioSkillsContent } from "@/lib/skills-schema";
import { persistSkills } from "@/lib/skills-store";
import { projectArraySchema, type PortfolioProject } from "@/lib/project-schema";
import { getDisplayProjects, persistProjects } from "@/lib/project-store";

export type SaveProjectsResult = { ok: true } | { ok: false; error: string };
export type SaveAboutResult = SaveProjectsResult;
export type SaveExperienceResult = SaveProjectsResult;
export type SaveGamingResult = SaveProjectsResult;
export type SaveSetupResult = SaveProjectsResult;
export type SaveSocialResult = SaveProjectsResult;
export type SaveSkillsResult = SaveProjectsResult;

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
  revalidatePath("/admin/projekt/redigera");
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
  revalidatePath("/admin/projekt/redigera");
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

export async function saveExperienceAction(data: unknown): Promise<SaveExperienceResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let content: PortfolioExperienceContent;
  try {
    content = experienceContentSchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  if (!content.heading.before.trim() && !content.heading.accent.trim()) {
    return { ok: false, error: "Huvudrubriken kan inte vara tom." };
  }

  try {
    await persistExperience(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/tidslinje/redigera");
  return { ok: true };
}

export async function saveGamingAction(data: unknown): Promise<SaveGamingResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let content: PortfolioGamingContent;
  try {
    content = gamingContentSchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  const slugs = content.games.map((g) => g.slug);
  if (new Set(slugs).size !== slugs.length) {
    return { ok: false, error: "Alla slug-värden måste vara unika." };
  }

  const slugSet = new Set(slugs);
  if (!slugSet.has(content.layout.mainGameSlug)) {
    return { ok: false, error: "Huvudspelet finns inte i spellistan." };
  }
  for (const s of content.layout.top3Slugs) {
    if (!slugSet.has(s)) {
      return { ok: false, error: "Topp 3-spel måste finnas i spellistan." };
    }
  }
  if (new Set(content.layout.top3Slugs).size !== 3) {
    return { ok: false, error: "Topp 3 måste vara tre olika spel." };
  }

  try {
    await persistGaming(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/gaming", "layout");
  revalidatePath("/gaming/[slug]", "page");
  revalidatePath("/admin/gaming/redigera");
  return { ok: true };
}

export async function saveSetupAction(data: unknown): Promise<SaveSetupResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let content: PortfolioSetupContent;
  try {
    content = setupContentSchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  if (!content.title.trim()) {
    return { ok: false, error: "Rubriken för datorn kan inte vara tom." };
  }
  if (!content.peripherals.title.trim()) {
    return { ok: false, error: "Rubriken för perifer kan inte vara tom." };
  }

  for (const item of [...content.specs, ...content.peripherals.items]) {
    if (item.href?.trim()) {
      try {
        new URL(item.href);
      } catch {
        return { ok: false, error: `Ogiltig länk för "${item.label}".` };
      }
    }
  }

  try {
    await persistSetup(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/setup/redigera");
  return { ok: true };
}

export async function saveSocialAction(data: unknown): Promise<SaveSocialResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let content: PortfolioSocialContent;
  try {
    content = socialContentSchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  if (!content.eyebrow.trim()) {
    return { ok: false, error: "Etiketten kan inte vara tom." };
  }
  if (!content.heading.before.trim() && !content.heading.accent.trim()) {
    return { ok: false, error: "Rubriken behöver minst text före eller efter accenten." };
  }
  if (!content.description.trim()) {
    return { ok: false, error: "Introtexten kan inte vara tom." };
  }

  for (const link of content.links) {
    if (!link.name.trim() || !link.href.trim()) {
      return { ok: false, error: "Varje kanal behöver namn och länk." };
    }
    try {
      new URL(link.href);
    } catch {
      return { ok: false, error: `Ogiltig länk för "${link.name}".` };
    }
  }

  try {
    await persistSocial(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/social/redigera");
  return { ok: true };
}

export async function saveSkillsAction(data: unknown): Promise<SaveSkillsResult> {
  if (!(await isAdminFromSession())) {
    return { ok: false, error: "Inte inloggad." };
  }

  let content: PortfolioSkillsContent;
  try {
    content = skillsContentSchema.parse(data);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Validering misslyckades.";
    return { ok: false, error: msg };
  }

  if (!content.eyebrow.trim()) {
    return { ok: false, error: "Etiketten kan inte vara tom." };
  }
  if (!content.heading.before.trim() && !content.heading.accent.trim()) {
    return { ok: false, error: "Rubriken behöver minst text före eller efter accenten." };
  }
  if (!content.description.trim()) {
    return { ok: false, error: "Introtexten kan inte vara tom." };
  }
  if (!content.groups.length) {
    return { ok: false, error: "Lägg till minst en kategori." };
  }

  for (const group of content.groups) {
    if (!group.title.trim()) {
      return { ok: false, error: "Varje kategori behöver ett namn." };
    }
    if (!group.items.length) {
      return { ok: false, error: `Kategorin "${group.title}" behöver minst ett verktyg.` };
    }
    for (const item of group.items) {
      if (!item.name.trim()) {
        return { ok: false, error: `Tom rad i "${group.title}".` };
      }
    }
  }

  try {
    await persistSkills(content);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Kunde inte spara.";
    return { ok: false, error: msg };
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/skills/redigera");
  return { ok: true };
}
