import { cn } from "@/lib/utils";

// ─── FieldLabel ───────────────────────────────────────────────────────────────

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-bold tracking-[0.13em] uppercase text-muted-foreground"
    >
      {children}
    </label>
  );
}

// ─── StyledTextarea ───────────────────────────────────────────────────────────


// ─── OptionButton ─────────────────────────────────────────────────────────────



// ─── StepShell ────────────────────────────────────────────────────────────────



// ─── ProgressBar ──────────────────────────────────────────────────────────────


// ─── PrimaryButton ────────────────────────────────────────────────────────────
