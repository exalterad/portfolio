"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioExperienceContent } from "@/lib/experience";
import { cn } from "@/lib/utils";

type ExperienceTimelineSectionProps = {
  content: PortfolioExperienceContent;
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function ExperienceTimelineSection({
  content,
  isAdmin = false,
  supabaseConfigured = false,
}: ExperienceTimelineSectionProps) {
  const { eyebrow, heading, milestones } = content;

  return (
    <section id="experience" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">{eyebrow}</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {heading.before}
                <span className="text-gradient">{heading.accent}</span>
              </h2>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/tidslinje/redigera"
                  title="Redigera Tidslinje"
                  aria-label="Redigera Tidslinje"
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
                  title="Konfigurera Supabase för att spara"
                  disabled
                  className="shrink-0 cursor-not-allowed rounded-xl border-white/15 bg-white/5 text-foreground opacity-40"
                  aria-label="Redigera Tidslinje (inaktiverat)"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div
            className="absolute left-[0.55rem] top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/45 via-white/15 to-cyan-400/40 sm:left-4"
            aria-hidden
          />
          <ol className="relative space-y-0">
            {milestones.map((m, i) => (
              <ScrollReveal key={m.id} delay={0.04 * i}>
                <li
                  className={cn(
                    "relative pb-11 pl-10 sm:pb-12 sm:pl-14",
                    i === milestones.length - 1 && "pb-0",
                  )}
                >
                  <span
                    className="absolute left-0 top-1.5 flex size-[1.125rem] items-center justify-center rounded-full border-2 border-background bg-gradient-to-br from-violet-400 to-cyan-400 shadow-[0_0_14px_rgba(168,85,247,0.45)] sm:left-[0.4rem] sm:top-2 sm:size-5"
                    aria-hidden
                  />
                  <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {m.period}
                  </p>
                  <h3 className="mt-1.5 font-[family-name:var(--font-orbitron)] text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                    {m.title}
                  </h3>
                  {m.detail ? (
                    <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {m.detail}
                    </p>
                  ) : null}
                </li>
              </ScrollReveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
