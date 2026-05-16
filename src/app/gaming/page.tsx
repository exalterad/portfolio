import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { GamingGameCard } from "@/components/gaming/gaming-game-card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { site } from "@/config/site";
import { Button, buttonVariants } from "@/components/ui/button";
import { getAuthState } from "@/lib/admin-auth";
import { getLibraryGames } from "@/lib/gaming";
import { isGamingStorageConfigured } from "@/lib/gaming-store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Spelbibliotek · Gaming · ${site.name}`,
  description: "Fler spel jag spelar — utöver main och topp 3.",
};

export default async function GamingLibraryPage() {
  const [games, { isAdmin }] = await Promise.all([getLibraryGames(), getAuthState()]);
  const supabaseConfigured = isGamingStorageConfigured();

  return (
    <div className="relative z-10 w-full px-4 pb-24 pt-8 sm:px-6 sm:pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <ScrollReveal className="min-w-0 flex-1">
            <Link
              href="/#gaming"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "-ml-2 inline-flex gap-1.5 text-muted-foreground hover:text-foreground",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden />
              Tillbaka till Gaming
            </Link>
            <p className="mt-8 text-xs font-medium tracking-[0.35em] text-cyan-300/90 uppercase">Bibliotek</p>
            <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Fler <span className="text-gradient">spel</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Titlar jag spelar eller återkommer till — utöver main och mina topp 3. Klicka för inställningar och detaljer.
            </p>
          </ScrollReveal>
          {isAdmin ? (
            supabaseConfigured ? (
              <Link
                href="/admin/gaming/redigera"
                title="Redigera Gaming"
                aria-label="Redigera Gaming"
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "shrink-0 rounded-xl border-white/15 bg-white/5 text-foreground shadow-[0_0_20px_rgba(168,85,247,0.12)] hover:border-primary/40 hover:bg-white/10",
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
                className="shrink-0 cursor-not-allowed rounded-xl border-white/15 bg-white/5 opacity-40"
                aria-label="Redigera Gaming (inaktiverat)"
              >
                <Pencil className="size-5" strokeWidth={2.25} />
              </Button>
            )
          ) : null}
        </div>

        {games.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">Inga fler spel i biblioteket just nu.</p>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {games.map((game, i) => (
              <ScrollReveal key={game.slug} delay={0.05 * i}>
                <GamingGameCard game={game} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
