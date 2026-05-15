"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, UserPlus } from "lucide-react";

import { signUpAction } from "@/app/(auth)/auth-actions";
import type { AuthFormState } from "@/lib/form-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

const initial: AuthFormState = { ok: true };

type RegisterFormProps = {
  configError: boolean;
};

export function RegisterForm({ configError }: RegisterFormProps) {
  const [state, formAction, pending] = useActionState(signUpAction, initial);

  if (state.ok && state.needsEmailConfirm) {
    return (
      <section className="relative flex flex-1 flex-col justify-center border-t border-white/10 py-10 sm:py-14">
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6">
          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Nästa steg</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-2xl font-semibold text-foreground">
            Bekräfta din e-post
          </h2>
          <p className="mt-4 text-muted-foreground">
            Vi har skickat en länk till din inkorg. När du klickat på länken kan du{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              logga in här
            </Link>
            .
          </p>
        </div>
      </section>
    );
  }

  const error =
    state.error ??
    (configError ? "Saknar NEXT_PUBLIC_SUPABASE_URL eller NEXT_PUBLIC_SUPABASE_ANON_KEY i miljön." : null);

  return (
    <section className="relative flex flex-1 flex-col justify-center border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_min(22rem,100%)] lg:items-center lg:gap-14 xl:grid-cols-[minmax(0,1.15fr)_min(24rem,100%)]">
          <ScrollReveal className="text-left">
            <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Nytt konto</p>
            <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Registrera dig
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              <p>
                Efter registrering får du standardrollen <span className="text-foreground">user</span>. För att kunna
                redigera projekt på sajten behöver din rad i <code className="text-xs">profiles</code> ha{" "}
                <span className="text-foreground">role = admin</span> — det gör du i Supabase Table Editor.
              </p>
              <p>
                Har du redan konto?{" "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Logga in
                </Link>
                .
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="w-full lg:max-w-md lg:justify-self-end">
            <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Skapa konto</CardTitle>
                <CardDescription>E-post, lösenord och bekräfta lösenord.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={formAction} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="reg-email">E-post</Label>
                    <Input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="du@exempel.se"
                      className="h-10 bg-background/50 md:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Lösenord</Label>
                    <Input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      autoComplete="new-password"
                      minLength={8}
                      className="h-10 bg-background/50 md:h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-confirm">Bekräfta lösenord</Label>
                    <Input
                      id="reg-confirm"
                      name="confirm"
                      type="password"
                      required
                      autoComplete="new-password"
                      minLength={8}
                      className="h-10 bg-background/50 md:h-11"
                    />
                  </div>
                  {error ? (
                    <p
                      role="status"
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        "border-destructive/40 bg-destructive/10 text-destructive-foreground",
                      )}
                    >
                      {error}
                    </p>
                  ) : null}
                  <Button
                    type="submit"
                    disabled={pending || configError}
                    className="h-10 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-slate-950 shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:brightness-110 disabled:opacity-60 sm:h-11"
                  >
                    {pending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Skapar konto…
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-4" />
                        Skapa konto
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
