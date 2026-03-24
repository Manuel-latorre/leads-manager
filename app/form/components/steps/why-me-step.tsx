import { StepProps } from "@/types/form";
import { StepShell } from "../ui/step-shell";
import { StyledTextarea } from "../ui/styled-textarea";

export function WhyMeStep({ values, errors, set }: StepProps) {
    return (
      <StepShell
        question="¿Por qué creés que puedo ayudarte?"
        error={errors.why_me}
      >
        <StyledTextarea
          id="why_me"
          label="Tu respuesta"
          value={values.why_me}
          onChange={(v) => set("why_me", v)}
          placeholder="Escribí tu respuesta acá..."
          hasError={!!errors.why_me}
        />
      </StepShell>
    );
  }