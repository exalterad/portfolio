"use client";

import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioSetupContent, SetupItem } from "@/lib/setup";
import { cn } from "@/lib/utils";

function linkLabel(href: string): string {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "extern sida";
  }
}

function SetupItemCard({ label, value, href }: Pick<SetupItem, "label" | "value" | "href">) {
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
      title={`Öppna ${linkLabel(href)} (ny flik)`}
      aria-label={`Visa ${label} på ${linkLabel(href)}`}
    >
      {card}
    </a>
  );
}

type SetupSectionProps = {
  content: PortfolioSetupContent;
  isAdmin?: boolean;
  supabaseConfigured?: boolean;
};

export function SetupSection({ content, isAdmin = false, supabaseConfigured = false }: SetupSectionProps) {
  return (
    <section id="setup" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium tracking-[0.35em] text-fuchsia-300/90 uppercase">Setup</p>
              <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {content.title}
              </h2>
            </div>
            {isAdmin ? (
              supabaseConfigured ? (
                <Link
                  href="/admin/setup/redigera"
                  title="Redigera Setup"
                  aria-label="Redigera Setup"
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
                  aria-label="Redigera Setup (inaktiverat)"
                >
                  <Pencil className="size-5" strokeWidth={2.25} />
                </Button>
              )
            ) : null}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-12 grid gap-4 sm:grid-cols-2">
          {content.specs.map((s) => (
            <SetupItemCard key={s.id} label={s.label} value={s.value} href={s.href} />
          ))}
        </ScrollReveal>

        <ScrollReveal className="mt-20 border-t border-white/10 pt-16">
          <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">Perifer</p>
          <h3 className="mt-3 font-[family-name:var(--font-orbitron)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {content.peripherals.title}
          </h3>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.peripherals.items.map((s) => (
              <SetupItemCard key={s.id} label={s.label} value={s.value} href={s.href} />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
