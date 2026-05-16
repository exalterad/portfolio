"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioProject } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectsSectionProps = {
  projects: PortfolioProject[];
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function ProjectsSection({ projects, isAdmin = false, supabaseConfigured = false }: ProjectsSectionProps) {
  return (
    <section id="projects" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-fuchsia-300/90 uppercase">Projekt</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Utvalda <span className="text-gradient">byggen</span>
              </h2>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/projekt/redigera"
                  title="Redigera Projekt"
                  aria-label="Redigera Projekt"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "shrink-0 cursor-pointer rounded-xl border-white/15 bg-white/5 text-foreground shadow-[0_0_20px_rgba(168,85,247,0.12)] hover:border-primary/40 hover:bg-white/10",
                  )}
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Link>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  title="Supabase saknas — kan inte redigera"
                  disabled
                  className="shrink-0 rounded-xl border-white/15 bg-white/5 opacity-60"
                  aria-label="Supabase saknas — kan inte redigera"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollReveal key={project.slug} delay={0.05 * i}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 320, damping: 24 }} className="relative">
                <Link href={`/projekt/${project.slug}`} className="group block h-full">
                  <Card className="glass-panel h-full overflow-hidden border-white/10 bg-white/[0.03] transition hover:border-primary/35 hover:shadow-[0_0_36px_rgba(168,85,247,0.22)]">
                    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/10">
                      <Image
                        src={project.image}
                        alt={project.imageAlt}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <span className="pointer-events-none absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-lg border border-white/15 bg-black/50 text-white opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
                        <ArrowUpRight className="size-4" aria-hidden />
                      </span>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg leading-snug">{project.title}</CardTitle>
                        {project.year ? (
                          <span className="shrink-0 font-[family-name:var(--font-orbitron)] text-xs text-muted-foreground">
                            {project.year}
                          </span>
                        ) : null}
                      </div>
                      <CardDescription className="line-clamp-3">{project.summary}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="rounded-md border border-white/10 bg-white/5 text-[0.65rem] font-normal text-muted-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>

    </section>
  );
}
