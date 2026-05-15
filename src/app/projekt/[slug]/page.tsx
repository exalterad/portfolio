import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { site } from "@/config/site";
import { ProjectPageAdminActions } from "@/components/admin/project-page-admin-actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAuthState } from "@/lib/admin-auth";
import { getProjectBySlug, getProjectSlugs } from "@/lib/projects";
import { isSupabaseConfigured } from "@/lib/project-store";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projekt" };
  return {
    title: `${project.title} · ${site.name}`,
    description: project.summary,
    openGraph: {
      title: `${project.title} · ${site.name}`,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const { isAdmin } = await getAuthState();
  const supabaseConfigured = isSupabaseConfigured();
  const showAdminBar = isAdmin && supabaseConfigured;

  const liveUrl = project.links?.live?.trim();
  const repoUrl = project.links?.repo?.trim();
  const hasLive = Boolean(liveUrl);
  const hasRepo = Boolean(repoUrl);

  return (
    <main className="relative z-10 min-h-[calc(100svh-4rem)] px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/#projects"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 mb-8 gap-1.5 text-muted-foreground hover:text-foreground"
          )}
        >
          <ArrowLeft className="size-4" />
          Tillbaka till projekt
        </Link>

        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-xl">
          {showAdminBar ? <ProjectPageAdminActions slug={project.slug} /> : null}
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width:768px) 100vw, 48rem"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {project.year ? (
            <span className="font-[family-name:var(--font-orbitron)] text-sm text-muted-foreground">{project.year}</span>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-md border border-white/10 bg-white/5 text-xs font-normal text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <h1 className="mt-6 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {project.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

        <div className="mt-10 space-y-5 text-base leading-relaxed text-muted-foreground">
          {project.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {(hasLive || hasRepo) && (
          <div className="mt-10 flex flex-wrap gap-3">
            {hasLive ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-6 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(168,85,247,0.35)]"
                )}
              >
                Besök live
                <ExternalLink className="size-4" />
              </a>
            ) : null}
            {hasRepo ? (
              <a
                href={repoUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 rounded-xl border-white/15 bg-white/5 px-6 text-sm backdrop-blur-sm hover:border-primary/40"
                )}
              >
                Kod / repo
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
