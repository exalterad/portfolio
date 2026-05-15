import { z } from "zod";

export const projectSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: små bokstäver, siffror och bindestreck."),
  title: z.string().min(1),
  summary: z.string().min(1),
  tags: z.array(z.string()),
  year: z.string(),
  image: z.string().min(1),
  imageAlt: z.string().min(1),
  paragraphs: z.array(z.string()).min(1),
  links: z.object({
    live: z.string(),
    repo: z.string(),
  }),
});

export const projectArraySchema = z.array(projectSchema);

export type PortfolioProject = z.infer<typeof projectSchema>;
