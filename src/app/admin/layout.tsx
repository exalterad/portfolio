import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { PortfolioPageFrame } from "@/components/portfolio/portfolio-page-frame";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplaySocial } from "@/lib/social";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [{ isLoggedIn, isAdmin, navUser }, social] = await Promise.all([getAuthState(), getDisplaySocial()]);
  return (
    <PortfolioPageFrame>
      <SiteNavbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} navUser={navUser} />
      <main className="flex w-full flex-1 flex-col pt-16">{children}</main>
      <SiteFooter socialLinks={social.links} />
    </PortfolioPageFrame>
  );
}
