/** Får inte ligga i `"use server"`-filer — importeras av server actions och klient. */

export type ContactState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string[]>>;
};

export const contactInitialState: ContactState = { ok: false, message: "" };

export type AuthFormState = { ok: boolean; error?: string; needsEmailConfirm?: boolean };
