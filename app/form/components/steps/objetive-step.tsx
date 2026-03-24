import { OBJECTIVE_OPTIONS, StepProps } from "@/types/form";
import { StepShell } from "../ui/step-shell";
import { OptionButton } from "../ui/option-button";

export function ObjectiveStep({ values, errors, set }: StepProps) {
    return (
      <StepShell
        question="¿Cuál es tu objetivo principal?"
        error={errors.main_objective}
      >
        {OBJECTIVE_OPTIONS.map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            selected={values.main_objective === opt}
            onSelect={() => set("main_objective", opt)}
          />
        ))}
      </StepShell>
    );
  }