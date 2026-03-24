import { StepProps } from "@/types/form";
import { StepShell } from "../ui/step-shell";
import { cn } from "@/lib/utils";

export function CommitmentLevelStep({ values, errors, set }: StepProps) {
    return (
      <StepShell
        question="¿Cuál es tu nivel de compromiso?"
        hint="1 = mínimo · 10 = máximo"
        error={errors.commitment_level}
      >
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
            const selected = values.commitment_level === String(n);
            return (
              <button
                key={n}
                type="button"
                onClick={() => set("commitment_level", String(n))}
                className={cn(
                  "h-16 rounded-xl text-lg font-bold outline-none border-none cursor-pointer transition-all duration-150",
                  selected
                    ? "bg-foreground text-background"
                    : "bg-card text-foreground/80",
                )}
              >
                {n}
              </button>
            );
          })}
        </div>
      </StepShell>
    );
  }