"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioAboutContent } from "@/lib/about";
import { cn } from "@/lib/utils";

type AboutSectionProps = {
  content: PortfolioAboutContent;
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function AboutSection({ content, isAdmin = false, supabaseConfigured = false }: AboutSectionProps) {
  const { sectionTitle, paragraphs } = content;

  return (
    <section id="about" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Om mig</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {sectionTitle.before}{" "}
                <span className="text-gradient">{sectionTitle.accent}</span>
              </h2>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/om-mig/redigera"
                  title="Redigera Om mig"
                  aria-label="Redigera Om mig"
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
                  aria-label="Redigera Om mig (inaktiverat)"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-10 sm:mt-12">
          <div className="glass-panel mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset,0_24px_80px_rgba(0,0,0,0.35)] sm:px-10 sm:py-12 md:px-14 md:py-16">
            <div className="space-y-7 sm:space-y-8">
              {paragraphs.map((paragraph, i) => (
                <ScrollReveal key={i} delay={0.05 * i} y={14}>
                  <p
                    className={cn(
                      "max-w-none text-pretty leading-[1.75] text-muted-foreground",
                      i === 0 ? "text-base sm:text-lg" : "text-sm sm:text-base",
                    )}
                  >
                    {paragraph}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
