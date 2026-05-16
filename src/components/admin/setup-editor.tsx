"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AlertCircle, ArrowDown, ArrowLeft, ArrowUp, Loader2, Plus, Trash2 } from "lucide-react";

import { saveSetupAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import type { PortfolioSetupContent, SetupItem } from "@/lib/setup-schema";
import { cn } from "@/lib/utils";

function newSetupItem(prefix: string): SetupItem {
  return {
    id: `${prefix}-${crypto.randomUUID().slice(0, 8)}`,
    label: "",
    value: "",
    href: "",
  };
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

type SetupItemsEditorProps = {
  title: string;
  description: string;
  items: SetupItem[];
  onChange: (items: SetupItem[]) => void;
  addLabel: string;
  idPrefix: string;
};

function SetupItemsEditor({ title, description, items, onChange, addLabel, idPrefix }: SetupItemsEditorProps) {
  function updateItem(id: string, patch: Partial<SetupItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  function moveItem(index: number, dir: -1 | 1) {
    const next = index + dir;
    if (next < 0 || next >= items.length) return;
    const copy = [...items];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item!);
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => onChange([...items, newSetupItem(idPrefix)])}
        >
          <Plus className="size-4" aria-hidden />
          {addLabel}
        </Button>
      </div>

      {items.map((item, index) => (
        <Card key={item.id} className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
          <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-2 text-left">
            <CardTitle className="text-base">#{index + 1}</CardTitle>
            <div className="flex shrink-0 gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8"
                disabled={index === 0}
                onClick={() => moveItem(index, -1)}
                aria-label="Flytta upp"
              >
                <ArrowUp className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 1)}
                aria-label="Flytta ned"
              >
                <ArrowDown className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-8 text-destructive hover:text-destructive"
                disabled={items.length <= 1}
                onClick={() => removeItem(item.id)}
                aria-label="Ta bort rad"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor={`label-${item.id}`}>Etikett</Label>
                <Input
                  id={`label-${item.id}`}
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder="CPU"
                  className="h-11 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`href-${item.id}`}>Länk (valfri)</Label>
                <Input
                  id={`href-${item.id}`}
                  value={item.href ?? ""}
                  onChange={(e) => updateItem(item.id, { href: e.target.value })}
                  placeholder="https://www.inet.se/produkt/..."
                  className="h-11 bg-background/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`value-${item.id}`}>Text / modell</Label>
              <Input
                id={`value-${item.id}`}
                value={item.value}
                onChange={(e) => updateItem(item.id, { value: e.target.value })}
                placeholder="AMD Ryzen 7 9800X3D ..."
                className="h-11 bg-background/50"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

type SetupEditorProps = {
  initial: PortfolioSetupContent;
  supabaseConfigured: boolean;
};

export function SetupEditor({ initial, supabaseConfigured }: SetupEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [specs, setSpecs] = useState<SetupItem[]>(initial.specs);
  const [peripheralsTitle, setPeripheralsTitle] = useState(initial.peripherals.title);
  const [peripherals, setPeripherals] = useState<SetupItem[]>(initial.peripherals.items);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function save() {
    setError(null);

    const trimmedSpecs = specs.map((s) => ({
      ...s,
      label: s.label.trim(),
      value: s.value.trim(),
      href: s.href?.trim() || undefined,
    }));
    const trimmedPeripherals = peripherals.map((s) => ({
      ...s,
      label: s.label.trim(),
      value: s.value.trim(),
      href: s.href?.trim() || undefined,
    }));

    if (!title.trim()) {
      setError("Rubriken för datorn kan inte vara tom.");
      return;
    }
    if (!peripheralsTitle.trim()) {
      setError("Rubriken för perifer kan inte vara tom.");
      return;
    }
    if (!trimmedSpecs.length || !trimmedPeripherals.length) {
      setError("Lägg till minst en rad i varje lista.");
      return;
    }

    for (const item of [...trimmedSpecs, ...trimmedPeripherals]) {
      if (!item.label || !item.value) {
        setError("Varje rad behöver etikett och text.");
        return;
      }
      if (item.href && !isValidUrl(item.href)) {
        setError(`Ogiltig länk för "${item.label}". Använd en full URL (https://...).`);
        return;
      }
    }

    const content: PortfolioSetupContent = {
      title: title.trim(),
      specs: trimmedSpecs,
      peripherals: {
        title: peripheralsTitle.trim(),
        items: trimmedPeripherals,
      },
    };

    startTransition(async () => {
      const res = await saveSetupAction(content);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/#setup");
      router.refresh();
    });
  }

  return (
    <section className="relative border-t border-white/10 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <Link
            href="/#setup"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "mb-8 inline-flex gap-2 text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowLeft className="size-4" aria-hidden />
            Tillbaka till Setup
          </Link>

          <p className="text-xs font-medium tracking-[0.35em] text-violet-300/90 uppercase">Admin</p>
          <h1 className="mt-3 font-[family-name:var(--font-orbitron)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Redigera <span className="text-gradient">Setup</span>
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Ändra rubriker, komponenttexter och länkar. Tom länk = kortet går inte att klicka.
          </p>
          {!supabaseConfigured ? (
            <p className="mt-3 text-sm text-amber-200/90">
              Supabase saknas i miljön — du kan fylla i formuläret men spara är avstängt.
            </p>
          ) : null}
        </ScrollReveal>

        <ScrollReveal delay={0.06} className="mt-10 space-y-8">
          <Card className="glass-panel border-white/10 bg-white/[0.03] shadow-xl">
            <CardHeader className="text-left">
              <CardTitle className="text-lg">Rubriker</CardTitle>
              <CardDescription>Överst i respektive del av Setup på startsidan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="setup-title">Dator — huvudrubrik</Label>
                <Input
                  id="setup-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Min dator"
                  className="h-11 bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peripherals-title">Perifer — underrubrik</Label>
                <Input
                  id="peripherals-title"
                  value={peripheralsTitle}
                  onChange={(e) => setPeripheralsTitle(e.target.value)}
                  placeholder="Gamingtillbehör"
                  className="h-11 bg-background/50"
                />
              </div>
            </CardContent>
          </Card>

          <SetupItemsEditor
            title="Dator — komponenter"
            description="T.ex. CPU, GPU, RAM. Länk öppnas i ny flik när besökaren klickar på kortet."
            items={specs}
            onChange={setSpecs}
            addLabel="Lägg till komponent"
            idPrefix="spec"
          />

          <SetupItemsEditor
            title="Perifer"
            description="Skärmar, mus, tangentbord m.m."
            items={peripherals}
            onChange={setPeripherals}
            addLabel="Lägg till tillbehör"
            idPrefix="peripheral"
          />

          {error ? (
            <p className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="button" onClick={save} disabled={isPending || !supabaseConfigured} className="min-w-[8rem]">
              {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "Spara"}
            </Button>
            <Link href="/#setup" className={buttonVariants({ variant: "ghost" })}>
              Avbryt
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
