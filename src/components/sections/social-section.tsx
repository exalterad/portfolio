import Link from "next/link";
import { FaDiscord, FaGithub, FaInstagram, FaSteam, FaTwitch } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

import { site } from "@/config/site";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const iconMap = {
  discord: FaDiscord,
  instagram: FaInstagram,
  tiktok: SiTiktok,
  github: FaGithub,
  steam: FaSteam,
  twitch: FaTwitch,
} as const;

export function SocialSection() {
  return (
    <section id="social" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Socialt</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Häng med <span className="text-gradient">live</span>
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {site.social.map((s, i) => {
            const Icon = iconMap[s.icon];
            return (
              <ScrollReveal key={s.name} delay={0.05 * i}>
                <Link href={s.href} target="_blank" rel="noreferrer" className="group block h-full">
                  <Card className="glass-panel h-full border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_0_36px_rgba(168,85,247,0.28)]">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <span className="inline-flex size-12 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-500/25 to-cyan-400/15 text-foreground transition group-hover:scale-105">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {s.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Öppnas i ny flik</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
