import { z } from "zod";

export const aboutContentSchema = z.object({
  sectionTitle: z.object({
    before: z.string(),
    accent: z.string(),
  }),
  paragraphs: z.array(z.string().min(1)).min(1),
});

export type PortfolioAboutContent = z.infer<typeof aboutContentSchema>;
