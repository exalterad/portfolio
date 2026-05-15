"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";
import { AlertCircle, Loader2, LogIn } from "lucide-react";

import { signInAction } from "@/app/(auth)/auth-actions";
import type { AuthFormState } from "@/lib/form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const initial: AuthFormState = { ok: true };

function prettifyLoginError(message: string): string {
  const m = message.trim();
  if (/invalid login credentials/i.test(m)) {
    return "Fel e-post eller lösenord. Kontrollera uppgifterna och försök igen.";
  }
  if (/email not confirmed|not confirmed/i.test(m)) {
    return "Bekräfta din e-postadress via länken i mailet innan du loggar in.";
  }
  return m;
}

function LoginFormAlert({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/[0.14] via-white/[0.04] to-cyan-500/[0.1] px-4 py-3.5 text-sm leading-relaxed text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_0_24px_rgba(168,85,247,0.12)]"
    >
      <AlertCircle className="mt-0.5 size-5 shrink-0 text-violet-300" aria-hidden />
      <p className="min-w-0 font-sans">{prettifyLoginError(message)}</p>
    </div>
  );
}

type LoginFormProps = {
  configError: boolean;
  registered: boolean;
  errorParam?: string;
};

export function LoginForm({ configError, registered, errorParam }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(signInAction, initial);
  const [clientError, setClientError] = useState<string | null>(null);

  const urlError =
    state.error ??
    (configError ? "Saknar nödvändig konfiguration för inloggning i miljön." : null);

  let queryError: string | null = null;
  if (errorParam === "missing_code") queryError = "Saknar bekräftelsekod från e-post.";
  else if (errorParam === "config") queryError = "Inloggning är inte konfigurerad på servern.";
  else if (errorParam)
    try {
      queryError = decodeURIComponent(errorParam);
    } catch {
      queryError = errorParam;
    }

  const serverOrUrlError = urlError ?? queryError;

  /** Server-/URL-fel har företräde; klientsidefel visas bara när servern inte skickat fel. */
  const displayError = serverOrUrlError ?? clientError;

  return (
    <section className="relative flex flex-1 flex-col justify-center border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_min(22rem,100%)] lg:items-center lg:gap-14 xl:grid-cols-[minmax(0,1.15fr)_min(24rem,100%)]">
          <ScrollReveal className="text-left">
            <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Konto</p>
            <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Logga in
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Välkommen tillbaka. Logga in om du redan har ett konto — då kan du bland annat komma åt adminläget för
                att hantera projekt på portfolion.
              </p>
              <p>
                Har du inget konto?{" "}
                <Link href="/register" className="text-primary underline-offset-4 hover:underline">
                  Skapa konto
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="w-full lg:max-w-md lg:justify-self-end">
            <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Inloggning</CardTitle>
                <CardDescription>Ange e-post och lösenord som hör till ditt konto.</CardDescription>
              </CardHeader>
              <CardContent>
                {registered ? (
                  <p className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                    Kontot skapades. Du kan logga in här med samma uppgifter. Om du fick ett bekräftelsemejl — klicka i
                    mailet först, sedan loggar du in.
                  </p>
                ) : null}
                <form
                  noValidate
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (pending || configError) return;
                    const form = e.currentTarget;
                    const fd = new FormData(form);
                    const email = String(fd.get("email") ?? "").trim();
                    const password = String(fd.get("password") ?? "");
                    setClientError(null);
                    if (!email && !password) {
                      setClientError("Fyll i både e-post och lösenord.");
                      return;
                    }
                    if (!email) {
                      setClientError("Ange din e-postadress.");
                      return;
                    }
                    if (!password) {
                      setClientError("Ange ditt lösenord.");
                      return;
                    }
                    startTransition(() => {
                      formAction(fd);
                    });
                  }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="login-email">E-post</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="du@exempel.se"
                      className="h-10 bg-background/50 md:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Lösenord</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      className="h-10 bg-background/50 md:h-11"
                    />
                  </div>
                  {displayError ? <LoginFormAlert message={displayError} /> : null}
                  <Button
                    type="submit"
                    disabled={pending || configError}
                    className="h-10 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-slate-950 shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:brightness-110 disabled:opacity-60 sm:h-11"
                  >
                    {pending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Loggar in…
                      </>
                    ) : (
                      <>
                        <LogIn className="size-4" />
                        Logga in
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
