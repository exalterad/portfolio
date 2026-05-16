import { z } from "zod";

export const experienceMilestoneSchema = z.object({
  id: z.string().min(1),
  period: z.string().min(1),
  title: z.string().min(1),
  detail: z.string(),
});

export const experienceContentSchema = z.object({
  eyebrow: z.string(),
  heading: z.object({
    before: z.string(),
    accent: z.string(),
  }),
  milestones: z.array(experienceMilestoneSchema).min(1),
});

export type ExperienceMilestone = z.infer<typeof experienceMilestoneSchema>;
export type PortfolioExperienceContent = z.infer<typeof experienceContentSchema>;
