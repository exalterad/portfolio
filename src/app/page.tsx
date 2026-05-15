import { PortfolioShell } from "@/components/portfolio/portfolio-shell";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayAbout } from "@/lib/about";
import { getDisplayProjects } from "@/lib/projects";
import { isSupabaseConfigured } from "@/lib/project-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, about] = await Promise.all([getDisplayProjects(), getDisplayAbout()]);
  const { isAdmin, isLoggedIn, navUser } = await getAuthState();
  const supabaseConfigured = isSupabaseConfigured();
  return (
    <PortfolioShell
      projects={projects}
      about={about}
      isAdmin={isAdmin}
      isLoggedIn={isLoggedIn}
      navUser={navUser}
      supabaseConfigured={supabaseConfigured}
    />
  );
}
