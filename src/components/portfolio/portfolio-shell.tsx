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
import type { NavSessionUser } from "@/lib/auth-types";
import type { PortfolioProject } from "@/lib/projects";

type PortfolioShellProps = {
  projects: PortfolioProject[];
  about: PortfolioAboutContent;
  steamPlaytimes?: Partial<Record<string, string>>;
  isAdmin?: boolean;
  isLoggedIn?: boolean;
  navUser?: NavSessionUser | null;
  supabaseConfigured?: boolean;
};

export function PortfolioShell({
  projects,
  about,
  steamPlaytimes = {},
  isAdmin = false,
  isLoggedIn = false,
  navUser = null,
  supabaseConfigured = false,
}: PortfolioShellProps) {
  return (
    <PortfolioPageFrame>
      <SiteNavbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} navUser={navUser} />
      <main className="flex-1 w-full">
        <HeroSection />
        <AboutSection content={about} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <ExperienceTimelineSection />
        <GamingSection steamPlaytimes={steamPlaytimes} />
        <SetupSection />
        <SocialSection />
        <SkillsSection />
        <ProjectsSection projects={projects} isAdmin={isAdmin} supabaseConfigured={supabaseConfigured} />
        <ContactSection />
      </main>
      <SiteFooter />
    </PortfolioPageFrame>
  );
}
