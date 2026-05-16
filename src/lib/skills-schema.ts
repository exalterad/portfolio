import { z } from "zod";

export const skillItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const skillGroupSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  items: z.array(skillItemSchema).min(1),
});

export const skillsContentSchema = z.object({
  eyebrow: z.string(),
  heading: z.object({
    before: z.string(),
    accent: z.string(),
  }),
  description: z.string(),
  groups: z.array(skillGroupSchema).min(1),
});

export type SkillItem = z.infer<typeof skillItemSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type PortfolioSkillsContent = z.infer<typeof skillsContentSchema>;
