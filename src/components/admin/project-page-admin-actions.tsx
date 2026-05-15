"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { deleteProjectBySlugAction } from "@/app/admin/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const CONFIRM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function randomTenCharCode(): string {
  const bytes = new Uint8Array(10);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += CONFIRM_ALPHABET[bytes[i]! % CONFIRM_ALPHABET.length]!;
  }
  return out;
}

const actionIconClass = cn(
  buttonVariants({ variant: "outline", size: "icon" }),
  "size-10 shrink-0 rounded-xl border-white/20 bg-black/70 text-white shadow-lg backdrop-blur-md hover:border-primary/45 hover:bg-black/85",
);

type ProjectPageAdminActionsProps = {
  slug: string;
};

export function ProjectPageAdminActions({ slug }: ProjectPageAdminActionsProps) {
  return (
    <div className="pointer-events-auto absolute right-3 top-3 z-20 flex gap-2">
      <Link
        href={`/admin/projekt/${slug}/redigera`}
        title="Redigera projekt"
        aria-label="Redigera projekt"
        className={actionIconClass}
      >
        <Pencil className="size-4" strokeWidth={2.25} />
      </Link>
      <DeleteProjectDialog slug={slug} />
    </div>
  );
}

function DeleteProjectDialog({ slug }: { slug: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [expected, setExpected] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openDialog() {
    setExpected(randomTenCharCode());
    setCode("");
    setError(null);
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setCode("");
    setError(null);
  }

  function submit() {
    setError(null);
    if (code.trim() !== expected) {
      setError("Koden stämmer inte. Försök igen eller stäng rutan.");
      return;
    }
    startTransition(async () => {
      const res = await deleteProjectBySlugAction(slug);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      close();
      router.push("/#projects");
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        title="Ta bort projekt"
        aria-label="Ta bort projekt"
        onClick={openDialog}
        className={cn(actionIconClass, "border-red-400/35 text-red-100 hover:border-red-400/55 hover:bg-red-950/50")}
      >
        <Trash2 className="size-4" strokeWidth={2.25} />
      </Button>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (next) setOpen(true);
          else close();
        }}
      >
        <DialogContent showCloseButton className="max-w-md sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ta bort projekt?</DialogTitle>
            <DialogDescription>
              Detta går inte att ångra. Skriv in bekräftelsekoden exakt som den visas (versaler, inga mellanslag).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Din kod</p>
              <p
                className="mt-1 select-all rounded-lg border border-white/15 bg-black/40 px-3 py-2.5 text-center font-mono text-lg tracking-[0.2em] text-foreground"
                aria-live="polite"
              >
                {expected || "…"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-project-confirm">Skriv koden här</Label>
              <Input
                id="delete-project-confirm"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                autoComplete="off"
                spellCheck={false}
                placeholder="Tio tecken"
                className="h-11 bg-background/50 font-mono uppercase tracking-wider"
                maxLength={10}
              />
            </div>
            {error ? (
              <p role="alert" className="text-sm text-red-300">
                {error}
              </p>
            ) : null}
          </div>

          <DialogFooter className="border-t-0 bg-transparent pt-2 sm:justify-between">
            <Button type="button" variant="outline" size="sm" disabled={isPending} onClick={close}>
              Avbryt
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending || code.trim() !== expected}
              onClick={submit}
              className="gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Tar bort…
                </>
              ) : (
                "Ta bort permanent"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
