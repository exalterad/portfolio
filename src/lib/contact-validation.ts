import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, "Ange ditt namn.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Ange din e-postadress.")
    .email("Ogiltig e-postadress."),
  message: z
    .string()
    .trim()
    .min(1, "Skriv ett meddelande.")
    .min(10, "Meddelandet behöver vara minst 10 tecken.")
    .max(5000),
});

export type ContactFieldErrors = Partial<Record<"name" | "email" | "message", string[]>>;

export function parseContactForm(data: {
  name: string;
  email: string;
  message: string;
}):
  | { ok: true; data: z.infer<typeof contactFormSchema> }
  | { ok: false; fieldErrors: ContactFieldErrors } {
  const parsed = contactFormSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: parsed.error.flatten().fieldErrors as ContactFieldErrors,
    };
  }
  return { ok: true, data: parsed.data };
}
