import { z } from "zod";

export const setupItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().optional(),
});

export const setupContentSchema = z.object({
  title: z.string().min(1),
  specs: z.array(setupItemSchema).min(1),
  peripherals: z.object({
    title: z.string().min(1),
    items: z.array(setupItemSchema).min(1),
  }),
});

export type SetupItem = z.infer<typeof setupItemSchema>;
export type PortfolioSetupContent = z.infer<typeof setupContentSchema>;
