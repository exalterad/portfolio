"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { site } from "@/config/site";
import type { AuthFormState } from "@/lib/form-state";
import { getAuthState } from "@/lib/admin-auth";
import { createSupabaseSessionClient } from "@/lib/supabase/server";

async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) {
    return `${proto === "https" || proto === "http" ? proto : "https"}://${host}`;
  }
  try {
    return new URL(site.url).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { ok: false, error: "Fyll i e-post och lösenord." };
  }

  const supabase = await createSupabaseSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Kunde inte läsa session efter inloggning." };
  }

  const { isAdmin } = await getAuthState();
  redirect(isAdmin ? "/" : "/ingen-admin");
}

export async function signUpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Fyll i alla fält." };
  }
  if (password !== confirm) {
    return { ok: false, error: "Lösenorden matchar inte." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Lösenordet måste vara minst 8 tecken." };
  }

  const supabase = await createSupabaseSessionClient();
  const origin = await requestOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (data.user && !data.session) {
    return { ok: true, needsEmailConfirm: true };
  }

  redirect("/login?registered=1");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseSessionClient();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
