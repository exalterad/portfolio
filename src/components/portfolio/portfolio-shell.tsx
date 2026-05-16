"use client";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { PortfolioPageFrame } from "@/components/portfolio/portfolio-page-frame";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceTimelineSection } from "@/components/sections/experience-timeline-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { GamingSection } from "@/components/sections/gaming-section";
import { HeroSection } from "@/components/sections/hero-section";
import { SetupSection } from "@/components/sections/setup-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { SocialSection } from "@/components/sections/social-section";
import type { PortfolioAboutContent } from "@/lib/about";
import type { PortfolioExperienceContent } from "@/lib/experience";
import type { NavSessionUser } from "@/lib/auth-types";
import type { GamingGame } from "@/lib/gaming";
import type { PortfolioProject } from "@/lib/projects";
import type { PortfolioSetupContent } from "@/lib/setup";
import type { PortfolioSocialContent } from "@/lib/social";
import type { PortfolioSkillsContent } from "@/lib/skills";

type PortfolioShellProps = {
  projects: PortfolioProject[];
  about: PortfolioAboutContent;
  experience: PortfolioExperienceContent;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  navUser?: NavSessionUser | null;
  supabaseConfigured?: boolean;
  gamingMainGame: GamingGame;
  gamingPodiumGames: [GamingGame, GamingGame, GamingGame];
  gamingLibraryCount?: number;
  setup: PortfolioSetupContent;
  social: PortfolioSocialContent;
  skills: PortfolioSkillsContent;
};

export function PortfolioShell({
  projects,
  about,
  experience,
  isAdmin = false,
  isLoggedIn = false,
  navUser = null,
  supabaseConfigured = false,
  gamingMainGame,
  gamingPodiumGames,
  gamingLibraryCount = 0,
  setup,
  social,
  skills,
}: PortfolioShellProps) {
  return (
    <PortfolioPageFrame>
      <SiteNavbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} navUser={navUser} />
      <main className="flex-1 w-full">
        <HeroSection socialLinks={social.links} />
        <AboutSection content={about} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <ExperienceTimelineSection
          content={experience}
          isAdmin={isAdmin}
          supabaseConfigured={supabaseConfigured}
        />
        <GamingSection
          mainGame={gamingMainGame}
          podiumGames={gamingPodiumGames}
          libraryCount={gamingLibraryCount}
          isAdmin={isAdmin}
          supabaseConfigured={supabaseConfigured}
        />
        <SetupSection content={setup} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <SocialSection content={social} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <SkillsSection content={skills} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <ProjectsSection projects={projects} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <ContactSection />
      </main>
      <SiteFooter socialLinks={social.links} />
    </PortfolioPageFrame>
  );
}
