"use server";

import { z } from "zod";

import type { ContactState } from "@/lib/form-state";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Ange ditt namn").max(120),
  email: z.string().trim().email("Ogiltig e-postadress"),
  message: z
    .string()
    .trim()
    .min(10, "Skriv minst några meningar (minst 10 tecken)")
    .max(5000),
});

/**
 * Skickar meddelande via [Web3Forms](https://web3forms.com) om `WEB3FORMS_ACCESS_KEY` finns i `.env.local`.
 * Skapa en access key på web3forms.com och lägg till: WEB3FORMS_ACCESS_KEY=din_nyckel
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as ContactState["fieldErrors"];
    return {
      ok: false,
      message: "Kontrollera fälten och försök igen.",
      fieldErrors,
    };
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return {
      ok: false,
      message:
        "Formuläret är inte kopplat än. Lägg till WEB3FORMS_ACCESS_KEY i .env.local (gratis på web3forms.com).",
    };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Portfolio: meddelande från ${parsed.data.name}`,
        from_name: parsed.data.name,
        email: parsed.data.email,
        message: parsed.data.message,
      }),
    });

    const json = (await response.json()) as { success?: boolean; message?: string };

    if (!response.ok || json.success === false) {
      return {
        ok: false,
        message: json.message ?? "Något gick fel vid sändning. Försök igen senare.",
      };
    }

    return { ok: true, message: "Tack! Jag återkommer så snart jag kan." };
  } catch {
    return { ok: false, message: "Kunde inte nå tjänsten. Försök igen om en stund." };
  }
}
