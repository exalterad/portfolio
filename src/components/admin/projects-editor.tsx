"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { deleteProjectBySlugAction, saveProjectsAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioProject } from "@/lib/project-schema";
import { cn } from "@/lib/utils";

type ProjectsEditorProps = {
  projects: PortfolioProject[];
  supabaseConfigured: boolean;
};

export function ProjectsEditor({ projects: initial, supabaseConfigured }: ProjectsEditorProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function persist(next: PortfolioProject[], onSuccess?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await saveProjectsAction(next);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setProjects(next);
      router.refresh();
      onSuccess?.();
    });
  }

  function moveProject(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= projects.length) return;
    const copy = [...projects];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item!);
    persist(copy);
  }

  function removeProject(slug: string) {
    if (!confirm("Ta bort det här projektet? Det går inte att ångra.")) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteProjectBySlugAction(slug);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
      router.refresh();
    });
  }

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#projects"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Projekt
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Projekt</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Lägg till, redigera eller ta bort projekt. Ordningen styr hur korten visas på startsidan.
          </p>
          {!supabaseConfigured ? (
            <p className="mt-3 text-sm text-amber-200/90">
              Supabase saknas i miljön — du kan inte spara ändringar.
            </p>
          ) : null}
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-10 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-foreground">Alla projekt</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {projects.length} {projects.length === 1 ? "projekt" : "projekt"} på portfolion
              </p>
            </div>
            {supabaseConfigured ? (
              <Link
                href="/admin/projekt/ny"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                <Plus className="size-4" aria-hidden />
                Lägg till projekt
              </Link>
            ) : (
              <Button type="button" variant="outline" size="sm" className="gap-1.5" disabled>
                <Plus className="size-4" aria-hidden />
                Lägg till projekt
              </Button>
            )}
          </div>

          {projects.length === 0 ? (
            <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                Inga projekt än.{" "}
                {supabaseConfigured ? (
                  <Link href="/admin/projekt/ny" className="text-primary underline-offset-4 hover:underline">
                    Skapa det första
                  </Link>
                ) : (
                  "Konfigurera Supabase för att spara."
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <Card key={project.slug} className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
                  <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3 text-left">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-white/10">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-snug">{project.title}</CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">{project.summary}</CardDescription>
                      <p className="mt-2 font-mono text-[0.65rem] text-muted-foreground/80">
                        /projekt/{project.slug}
                        {project.year ? ` · ${project.year}` : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        disabled={index === 0 || isPending || !supabaseConfigured}
                        onClick={() => moveProject(index, -1)}
                        aria-label="Flytta upp"
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        disabled={index === projects.length - 1 || isPending || !supabaseConfigured}
                        onClick={() => moveProject(index, 1)}
                        aria-label="Flytta ned"
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                      {supabaseConfigured ? (
                        <Link
                          href={`/admin/projekt/${project.slug}/redigera`}
                          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-8")}
                          title="Redigera projekt"
                          aria-label="Redigera projekt"
                        >
                          <Pencil className="size-4" />
                        </Link>
                      ) : (
                        <Button type="button" size="icon" variant="ghost" className="size-8" disabled>
                          <Pencil className="size-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="size-8 text-destructive hover:text-destructive"
                        disabled={isPending || !supabaseConfigured}
                        onClick={() => removeProject(project.slug)}
                        aria-label="Ta bort projekt"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground">
                      {project.tags.length ? project.tags.join(" · ") : "Inga taggar"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error ? (
            <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}

          {isPending ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Sparar…
            </p>
          ) : null}

          <Link href="/#projects" className={buttonVariants({ variant: "ghost" })}>
            Stäng
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

