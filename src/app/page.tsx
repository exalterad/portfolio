import { PortfolioShell } from "@/components/portfolio/portfolio-shell";
import { getAuthState } from "@/lib/admin-auth";
import { getDisplayAbout } from "@/lib/about";
import { getDisplayExperience } from "@/lib/experience";
import { getGamingSectionData } from "@/lib/gaming";
import { getDisplaySetup } from "@/lib/setup";
import { getDisplaySocial } from "@/lib/social";
import { getDisplaySkills } from "@/lib/skills";
import { getDisplayProjects } from "@/lib/projects";
import { isSupabaseConfigured } from "@/lib/project-store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, about, experience, gaming, setup, social, skills] = await Promise.all([
    getDisplayProjects(),
    getDisplayAbout(),
    getDisplayExperience(),
    getGamingSectionData(),
    getDisplaySetup(),
    getDisplaySocial(),
    getDisplaySkills(),
  ]);
  const { isAdmin, isLoggedIn, navUser } = await getAuthState();
  const supabaseConfigured = isSupabaseConfigured();
  return (
    <PortfolioShell
      projects={projects}
      about={about}
      experience={experience}
      isAdmin={isAdmin}
      isLoggedIn={isLoggedIn}
      navUser={navUser}
      supabaseConfigured={supabaseConfigured}
      gamingMainGame={gaming.mainGame}
      gamingPodiumGames={gaming.podiumGames}
      gamingLibraryCount={gaming.libraryCount}
      setup={setup}
      social={social}
      skills={skills}
    />
  );
}
