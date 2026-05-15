"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";

import { submitContact } from "@/app/actions/contact";
import { contactInitialState } from "@/lib/form-state";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-xs text-destructive">{messages[0]}</p>;
}

export function ContactSection() {
  const [state, formAction, pending] = useActionState(submitContact, contactInitialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <section id="contact" className="relative scroll-mt-24 border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_min(22rem,100%)] lg:items-start lg:gap-14 xl:grid-cols-[minmax(0,1.15fr)_min(24rem,100%)]">
          <ScrollReveal className="text-left">
            <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">
              {site.contact.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {site.contact.title}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {site.contact.body.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-8 text-sm text-muted-foreground">
              Direktmejl:{" "}
              <a href={`mailto:${site.email}`} className="text-primary underline-offset-4 hover:underline">
                {site.email}
              </a>
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.08} className="w-full lg:max-w-md lg:justify-self-end">
            <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
              <CardHeader className="text-left">
                <CardTitle className="text-lg">Kontaktformulär</CardTitle>
                <CardDescription>Fyll i fälten så återkommer jag via e-post.</CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} action={formAction} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Namn</Label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Ditt namn"
                      aria-invalid={Boolean(state.fieldErrors?.name?.length)}
                      className="h-10 bg-background/50 md:h-11"
                    />
                    <FieldError messages={state.fieldErrors?.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">E-post</Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="du@exempel.se"
                      aria-invalid={Boolean(state.fieldErrors?.email?.length)}
                      className="h-10 bg-background/50 md:h-11"
                    />
                    <FieldError messages={state.fieldErrors?.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">Meddelande</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={5}
                      placeholder="Hej Alexander…"
                      aria-invalid={Boolean(state.fieldErrors?.message?.length)}
                      className="min-h-32 resize-y bg-background/50"
                    />
                    <FieldError messages={state.fieldErrors?.message} />
                  </div>

                  {state.message ? (
                    <p
                      role="status"
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        state.ok
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                          : "border-destructive/40 bg-destructive/10 text-destructive-foreground"
                      )}
                    >
                      {state.message}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={pending}
                    className="h-10 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 font-semibold text-slate-950 shadow-[0_0_28px_rgba(168,85,247,0.35)] hover:brightness-110 disabled:opacity-60 sm:h-11"
                  >
                    {pending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Skickar…
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Skicka meddelande
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
