"use client";

import { useActionState, useEffect, useRef, useState, startTransition, type FormEvent } from "react";
import { Clock, Loader2, Send } from "lucide-react";

import { submitContact } from "@/app/actions/contact";
import { contactInitialState } from "@/lib/form-state";
import { parseContactForm, type ContactFieldErrors } from "@/lib/contact-validation";
import { site } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

const { eyebrow, heading, intro, body } = site.contact;

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-xs text-destructive">{messages[0]}</p>;
}

export function ContactSection() {
  const [state, formAction, pending] = useActionState(submitContact, contactInitialState);
  const [clientErrors, setClientErrors] = useState<ContactFieldErrors | undefined>();
  const [clientMessage, setClientMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const fieldErrors = state.fieldErrors ?? clientErrors;
  const statusMessage = state.message || clientMessage;
  const showStatus = Boolean(statusMessage);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setClientErrors(undefined);
      setClientMessage("");
    }
  }, [state.ok]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = parseContactForm({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
    });

    if (!result.ok) {
      setClientErrors(result.fieldErrors);
      setClientMessage("Fyll i alla obligatoriska fält.");
      return;
    }

    setClientErrors(undefined);
    setClientMessage("");
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <section id="contact" className="relative scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">{eyebrow}</p>
          <h2 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {heading.before}
            <span className="text-gradient">{heading.accent}</span>
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{intro}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.08} className="mt-12 sm:mt-14">
          <div className="glass-panel relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] shadow-[0_0_56px_rgba(168,85,247,0.16),0_0_100px_rgba(34,211,238,0.08)] ring-1 ring-white/[0.06]">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-violet-500/50 via-cyan-400/40 to-transparent"
              aria-hidden
            />
            <div className="grid lg:grid-cols-12">
              <aside className="border-b border-white/10 p-8 sm:p-10 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-12">
                <div className="flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4">
                  <Clock className="mt-0.5 size-4 shrink-0 text-cyan-300/80" aria-hidden />
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Jag svarar så snart jag hunnit läsa ordentligt — oftast inom några timmar.
                  </p>
                </div>

                <ul className="mt-8 space-y-6">
                  {body.map((paragraph, idx) => (
                    <li
                      key={idx}
                      className="border-l-2 border-violet-500/35 pl-4 text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      {paragraph}
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="p-8 sm:p-10 lg:col-span-7 lg:p-12">
                <p className="text-xs font-medium tracking-[0.35em] text-cyan-300/80 uppercase">Meddelande</p>
                <form ref={formRef} noValidate onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">
                      Namn <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-name"
                      name="name"
                      required
                      aria-required="true"
                      autoComplete="name"
                      placeholder="Ditt namn"
                      aria-invalid={Boolean(fieldErrors?.name?.length)}
                      className={cn(
                        "h-12 border-white/10 bg-background/50 text-base",
                        fieldErrors?.name?.length && "border-destructive/50",
                      )}
                    />
                    <FieldError messages={fieldErrors?.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-email">
                      E-post <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      aria-required="true"
                      autoComplete="email"
                      placeholder="du@exempel.se"
                      aria-invalid={Boolean(fieldErrors?.email?.length)}
                      className={cn(
                        "h-12 border-white/10 bg-background/50 text-base",
                        fieldErrors?.email?.length && "border-destructive/50",
                      )}
                    />
                    <FieldError messages={fieldErrors?.email} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-message">
                      Meddelande <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      required
                      aria-required="true"
                      rows={6}
                      placeholder="Hej Alexander…"
                      aria-invalid={Boolean(fieldErrors?.message?.length)}
                      className={cn(
                        "min-h-40 resize-y border-white/10 bg-background/50 text-base",
                        fieldErrors?.message?.length && "border-destructive/50",
                      )}
                    />
                    <FieldError messages={fieldErrors?.message} />
                  </div>

                  {showStatus ? (
                    <p
                      role="status"
                      className={cn(
                        "rounded-lg border px-3 py-2 text-sm",
                        state.ok
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                          : "border-destructive/40 bg-destructive/10 text-destructive-foreground",
                      )}
                    >
                      {statusMessage}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={pending}
                    className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 text-base font-semibold text-slate-950 shadow-[0_0_32px_rgba(168,85,247,0.4)] hover:brightness-110 disabled:opacity-60"
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
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
