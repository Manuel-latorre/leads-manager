import { StepProps } from "@/types/form";
import { StyledInput } from "../ui/styled-input";
import { StepShell } from "../ui/step-shell";
import { PhoneInput } from "../ui/phone-input";

export function ContactWorkStep({ values, errors, set }: StepProps) {
  return (
    <StepShell
      question="¿A qué te dedicás y cómo te encuentro?"
      hint="Todos los campos son obligatorios."
      error={errors.occupation || errors.whatsapp}
    >
      <StyledInput
        id="occupation"
        label="Ocupación"
        value={values.occupation}
        onChange={(v) => set("occupation", v)}
        placeholder="Ingrese su ocupación"
        autoComplete="organization-title"
        autoCapitalize="words"
        hasError={!!errors.occupation}
      />
      <PhoneInput
        id="whatsapp"
        label="WhatsApp"
        value={values.whatsapp}
        onChange={(v) => set("whatsapp", v)}
        hasError={!!errors.whatsapp}
      />
      <StyledInput
        id="instagram"
        label="Instagram"
        value={values.instagram}
        onChange={(v) => set("instagram", v)}
        placeholder="Ingrese su instagram (sin @)"
        autoComplete="off"
        autoCapitalize="none"
        optional
      />
    </StepShell>
  );
}