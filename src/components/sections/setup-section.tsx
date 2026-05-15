import { ExternalLink } from "lucide-react";

import { site } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

function SetupItemCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const card = (
    <Card
      className={cn(
        "glass-panel h-full border-white/10 bg-white/[0.03] transition",
        href ? "group-hover/card:border-primary/45 group-hover/card:shadow-[0_0_24px_rgba(168,85,247,0.12)]" : "hover:border-primary/30",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            {label}
          </CardTitle>
          {href ? (
            <ExternalLink
              className="mt-0.5 size-3.5 shrink-0 text-muted-foreground opacity-50 transition group-hover/card:opacity-100"
              aria-hidden
            />
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-base font-medium text-foreground sm:text-lg">{value}</p>
      </CardContent>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      title="Öppna hos Inet (ny flik)"
      aria-label={`Visa ${label} på Inet`}
    >
      {card}
    </a>
  );
}

export function SetupSection() {
  return (
    <section id="setup" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.35em] text-fuchsia-300/90 uppercase">Setup</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {site.setup.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-12 grid gap-4 sm:grid-cols-2">
          {site.setup.specs.map((s) => (
            <SetupItemCard key={s.label} label={s.label} value={s.value} href={s.href} />
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-20 border-t border-white/10 pt-16">
          <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">Perifer</p>
          <h3 className="mt-3 font-[family-name:var(--font-orbitron)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {site.setup.peripherals.title}
          </h3>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {site.setup.peripherals.items.map((s) => (
              <SetupItemCard key={s.label} label={s.label} value={s.value} href={s.href} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
