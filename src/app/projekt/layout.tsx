import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { getAuthState } from "@/lib/admin-auth";

export default async function ProjektLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin, navUser } = await getAuthState();
  return (
    <>
      <SiteNavbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} navUser={navUser} />
      {children}
      <SiteFooter />
    </>
  );
}
