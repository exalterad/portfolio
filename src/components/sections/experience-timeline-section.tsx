"use client";

import { site } from "@/config/site";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

export function ExperienceTimelineSection() {
  const { experience } = site;

  return (
    <section id="experience" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">{experience.eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {experience.heading.before}
            <span className="text-gradient">{experience.heading.accent}</span>
          </h2>
        </ScrollReveal>

        <div className="relative mx-auto mt-14 max-w-2xl">
          <div
            className="absolute left-[0.55rem] top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/45 via-white/15 to-cyan-400/40 sm:left-4"
            aria-hidden
          />
          <ol className="relative space-y-0">
            {experience.milestones.map((m, i) => (
              <ScrollReveal key={`${m.period}-${m.title}`} delay={0.04 * i}>
                <li
                  className={cn(
                    "relative pb-11 pl-10 sm:pb-12 sm:pl-14",
                    i === experience.milestones.length - 1 && "pb-0",
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
