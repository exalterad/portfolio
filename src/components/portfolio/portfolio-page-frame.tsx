"use client";

import { AmbientBlobs } from "@/components/effects/ambient-blobs";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { PageLoader } from "@/components/effects/page-loader";
import { ParticlesField } from "@/components/effects/particles-field";
import { BackToTop } from "@/components/layout/back-to-top";

type PortfolioPageFrameProps = {
  children: React.ReactNode;
};

export function PortfolioPageFrame({ children }: PortfolioPageFrameProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <PageLoader />

      <div className="pointer-events-none fixed inset-0 z-0">
        <AmbientBlobs />
        <ParticlesField />
      </div>

      <CursorGlow />

      <div className="relative z-10 flex min-h-screen flex-col">{children}</div>

      <BackToTop />
    </div>
  );
}
