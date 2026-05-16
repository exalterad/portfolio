"use client";

import Link from "next/link";
import { useState } from "react";
import { Pencil } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioSkillsContent } from "@/lib/skills";
import { cn } from "@/lib/utils";

const groupThemes = [
  {
    label: "text-violet-300/90",
    active:
      "border-violet-400/50 bg-violet-500/15 text-foreground shadow-[0_0_24px_rgba(168,85,247,0.2)]",
    index: "text-violet-400/80",
    line: "from-violet-500/50 to-transparent",
  },
  {
    label: "text-cyan-300/90",
    active: "border-cyan-400/50 bg-cyan-400/10 text-foreground shadow-[0_0_24px_rgba(34,211,238,0.18)]",
    index: "text-cyan-400/80",
    line: "from-cyan-400/50 to-transparent",
  },
  {
    label: "text-fuchsia-300/90",
    active:
      "border-fuchsia-400/50 bg-fuchsia-500/10 text-foreground shadow-[0_0_24px_rgba(217,70,239,0.18)]",
    index: "text-fuchsia-400/80",
    line: "from-fuchsia-500/50 to-transparent",
  },
  {
    label: "text-violet-300/80",
    active: "border-primary/45 bg-white/[0.08] text-foreground shadow-[0_0_24px_rgba(168,85,247,0.15)]",
    index: "text-cyan-300/70",
    line: "from-violet-400/40 via-cyan-400/30 to-transparent",
  },
] as const;

type SkillsSectionProps = {
  content: PortfolioSkillsContent;
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function SkillsSection({ content, isAdmin = false, supabaseConfigured = false }: SkillsSectionProps) {
  const [active, setActive] = useState(0);
  const safeActive = Math.min(active, Math.max(0, content.groups.length - 1));
  const group = content.groups[safeActive] ?? content.groups[0]!;
  const theme = groupThemes[safeActive] ?? groupThemes[0]!;
  const { eyebrow, heading, description, groups } = content;

  return (
    <section id="skills" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">{eyebrow}</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {heading.before}
                <span className="text-gradient">{heading.accent}</span>
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/skills/redigera"
                  title="Redigera Skills"
                  aria-label="Redigera Skills"
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
                  disabled
                  title="Supabase saknas — kan inte redigera"
                  aria-label="Supabase saknas — kan inte redigera"
                  className="shrink-0 rounded-xl border-white/15 bg-white/5 opacity-60"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12 sm:mt-14">
          <div className="glass-panel overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_0_48px_rgba(168,85,247,0.08)]">
            <div className="grid md:grid-cols-[minmax(0,10.5rem)_1fr]">
              <div
                className="flex gap-2 overflow-x-auto border-b border-white/10 p-3 md:flex-col md:overflow-visible md:border-b-0 md:border-r md:p-4"
                role="tablist"
                aria-label="Kompetenskategorier"
              >
                {groups.map((g, i) => {
                  const t = groupThemes[i] ?? groupThemes[0]!;
                  const isActive = safeActive === i;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`skills-panel-${i}`}
                      id={`skills-tab-${i}`}
                      onClick={() => setActive(i)}
                      className={cn(
                        "shrink-0 rounded-xl border border-transparent px-4 py-3 text-left transition duration-300",
                        "font-[family-name:var(--font-orbitron)] text-[0.65rem] font-semibold tracking-[0.18em] uppercase sm:text-xs",
                        isActive ? t.active : "text-muted-foreground hover:border-white/10 hover:bg-white/[0.04]",
                      )}
                    >
                      <span className={cn("block", isActive ? "text-foreground" : t.label)}>{g.title}</span>
                      <span className="mt-1 block text-[0.6rem] font-normal tracking-normal text-muted-foreground/80 normal-case">
                        {g.items.length} verktyg
                      </span>
                    </button>
                  );
                })}
              </div>

              <div
                id={`skills-panel-${safeActive}`}
                role="tabpanel"
                aria-labelledby={`skills-tab-${safeActive}`}
                className="relative min-h-[17rem] p-6 sm:min-h-[19rem] sm:p-8 lg:p-10"
              >
                <div
                  className={cn(
                    "pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r sm:inset-x-8 lg:inset-x-10",
                    theme.line,
                  )}
                  aria-hidden
                />
                <p
                  className="pointer-events-none absolute right-4 top-2 font-[family-name:var(--font-orbitron)] text-5xl font-bold tracking-tighter text-white/[0.04] sm:right-6 sm:text-7xl"
                  aria-hidden
                >
                  {String(safeActive + 1).padStart(2, "0")}
                </p>
                <p className={cn("text-xs font-medium tracking-[0.35em] uppercase", theme.label)}>{group.title}</p>
                <ul className="relative mt-6 grid gap-0 sm:grid-cols-2 sm:gap-x-8">
                  {group.items.map((skill, i) => (
                    <li
                      key={skill.id}
                      className="group flex items-baseline gap-3 border-b border-white/[0.06] py-3.5 sm:py-4"
                    >
                      <span
                        className={cn(
                          "w-7 shrink-0 font-[family-name:var(--font-orbitron)] text-[0.65rem] font-bold tabular-nums tracking-wider",
                          theme.index,
                        )}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-lg font-medium text-foreground/85 transition duration-300 group-hover:text-gradient sm:text-xl">
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
