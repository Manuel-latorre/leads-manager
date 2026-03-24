import { StepProps } from "@/types/form";
import { StepShell } from "../ui/step-shell";
import { StyledTextarea } from "../ui/styled-textarea";

export function ImportanceStep({ values, errors, set }: StepProps) {
    return (
      <StepShell
        question="¿Por qué es importante para vos lograrlo?"
        error={errors.importance}
      >
        <StyledTextarea
          id="importance"
          label="Tu respuesta"
          value={values.importance}
          onChange={(v) => set("importance", v)}
          placeholder="Escribí tu respuesta acá..."
          hasError={!!errors.importance}
        />
      </StepShell>
    );
  }