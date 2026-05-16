import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertCircle } from "lucide-react";

import { signOutAction } from "@/app/(auth)/auth-actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { PortfolioPageFrame } from "@/components/portfolio/portfolio-page-frame";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { getAuthState } from "@/lib/admin-auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function IngenAdminPage() {
  const { isLoggedIn, isAdmin, navUser } = await getAuthState();
  if (!isLoggedIn) redirect("/login");
  if (isAdmin) redirect("/");

  return (
    <PortfolioPageFrame>
      <SiteNavbar isLoggedIn isAdmin={false} navUser={navUser} />
      <main className="flex w-full flex-1 flex-col pt-16">
        <section className="relative flex flex-1 flex-col justify-center border-t border-white/10 py-16 sm:py-20">
          <div className="mx-auto w-full max-w-lg px-4 sm:px-6">
            <ScrollReveal>
              <div
                role="alert"
                className="flex gap-3 rounded-2xl border border-amber-500/35 bg-gradient-to-br from-amber-500/[0.12] via-white/[0.04] to-violet-500/[0.08] px-5 py-5 text-sm leading-relaxed text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden />
                <div className="min-w-0 space-y-3">
                  <p className="font-semibold text-foreground">Ingen administratörsåtkomst</p>
                  <p className="text-muted-foreground">
                    Du är inloggad, men det här kontot har inte adminroll i portfolion. Endast utvalda konton kan
                    redigera innehåll.
                  </p>
                  <p className="text-muted-foreground">
                    Behöver du åtkomst? Kontakta ägaren av sajten. Annars kan du logga ut och gå tillbaka till startsidan.
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
                <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full sm:w-auto")}>
                  Till startsidan
                </Link>
                <form action={signOutAction} className="w-full sm:w-auto">
                  <Button type="submit" variant="secondary" className="w-full sm:w-auto">
                    Logga ut
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </PortfolioPageFrame>
  );
}
