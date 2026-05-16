import { z } from "zod";

export const socialIconIds = [
  "twitch",
  "discord",
  "github",
  "steam",
  "instagram",
  "tiktok",
] as const;

export type SocialIconId = (typeof socialIconIds)[number];

export const socialIconSchema = z.enum(socialIconIds);

export const socialLinkSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  href: z.string().min(1),
  icon: socialIconSchema,
  handle: z.string().optional(),
});

export const socialContentSchema = z.object({
  eyebrow: z.string(),
  heading: z.object({
    before: z.string(),
    accent: z.string(),
  }),
  description: z.string(),
  links: z.array(socialLinkSchema).min(1),
});

export type SocialLink = z.infer<typeof socialLinkSchema>;
export type PortfolioSocialContent = z.infer<typeof socialContentSchema>;

export const socialIconLabels: Record<SocialIconId, string> = {
  twitch: "Twitch",
  discord: "Discord",
  github: "GitHub",
  steam: "Steam",
  instagram: "Instagram",
  tiktok: "TikTok",
};
