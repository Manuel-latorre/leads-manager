import { GYM_OPTIONS, StepProps } from "@/types/form";
import { StepShell } from "../ui/step-shell";
import { OptionButton } from "../ui/option-button";

export function GymExperienceStep({ values, errors, set }: StepProps) {
    return (
      <StepShell
        question="¿Cuánta experiencia tenés en el gimnasio?"
        error={errors.gym_experience}
      >
        {GYM_OPTIONS.map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            selected={values.gym_experience === opt}
            onSelect={() => set("gym_experience", opt)}
          />
        ))}
      </StepShell>
    );
  }