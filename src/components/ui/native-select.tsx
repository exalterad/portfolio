import { cn } from "@/lib/utils";

type NativeSelectProps = React.ComponentProps<"select">;

/** Native &lt;select&gt; med läsbar lista i mörkt tema (Windows/Chrome). */
export function NativeSelect({ className, children, ...props }: NativeSelectProps) {
  return (
    <select
      className={cn(
        "flex h-10 w-full cursor-pointer appearance-none rounded-xl border border-white/15 bg-zinc-950/95 px-3 text-sm text-foreground shadow-sm outline-none scheme-dark",
        "focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/25",
        "[&_option]:bg-zinc-900 [&_option]:text-zinc-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
