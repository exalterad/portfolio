"use client";

import { site } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function SkillsSection() {
  return (
    <section id="skills" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">Skills</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Tech stack & <span className="text-gradient">craft</span>
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {site.skills.groups.map((group, i) => (
            <ScrollReveal key={group.title} delay={0.05 * i}>
              <Card className="glass-panel h-full border-white/10 bg-white/[0.03] transition hover:border-primary/25">
                <CardHeader className="pb-3">
                  <CardTitle className="text-[0.7rem] font-semibold tracking-[0.25em] text-muted-foreground uppercase">
                    {group.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 pt-0">
                  {group.items.map((item) => (
                    <Badge
                      key={item}
                      variant="secondary"
                      className="rounded-lg border border-white/10 bg-black/35 px-2.5 py-1 text-xs font-medium text-foreground/90 transition hover:border-primary/35 hover:bg-white/[0.06] hover:text-foreground"
                    >
                      {item}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
