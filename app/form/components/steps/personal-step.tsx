import { FormErrors, FormValues } from "@/schemas/form";
import { StepShell } from "../ui/step-shell";
import { StyledInput } from "../ui/styled-input";
import { StepProps } from "@/types/form";

export function PersonalStep({ values, errors, set }: StepProps) {
    return (
      <StepShell
        question="Primero, contame sobre vos"
        error={errors.full_name || errors.age || errors.nationality}
      >
        <StyledInput
          id="full_name"
          label="Nombre completo"
          value={values.full_name}
          onChange={(v) => set("full_name", v)}
          placeholder="Ingrese su nombre y apellido"
          autoComplete="name"
          autoCapitalize="words"
          hasError={!!errors.full_name}
        />
        <div className="grid grid-cols-2 gap-3">
          <StyledInput
            id="age"
            label="Edad"
            value={values.age}
            onChange={(v) => set("age", v.replace(/\D/g, "").slice(0, 2))}
            placeholder="Ingrese su edad"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            hasError={!!errors.age}
          />
          <StyledInput
            id="nationality"
            label="Nacionalidad"
            value={values.nationality}
            onChange={(v) => set("nationality", v)}
            placeholder="Ingrese su nacionalidad"
            autoComplete="country-name"
            autoCapitalize="words"
            hasError={!!errors.nationality}
          />
        </div>
      </StepShell>
    );
  }
  