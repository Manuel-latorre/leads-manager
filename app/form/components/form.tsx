"use client";

import * as React from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPTY, FormErrors, formSchema, FormValues } from "../types";
import { createLead } from "../actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId =
  | "intro"
  | "personal"
  | "contact_work"
  | "objective"
  | "why_me"
  | "importance"
  | "gym_experience"
  | "commitment_level"
  | "success";

interface Step {
  id: StepId;
  fields: (keyof FormValues)[];
}

const STEPS: Step[] = [
  { id: "intro", fields: [] },
  { id: "personal", fields: ["full_name", "age", "nationality"] },
  { id: "contact_work", fields: ["occupation", "whatsapp", "instagram"] },
  { id: "objective", fields: ["main_objective"] },
  { id: "why_me", fields: ["why_me"] },
  { id: "importance", fields: ["importance"] },
  { id: "gym_experience", fields: ["gym_experience"] },
  { id: "commitment_level", fields: ["commitment_level"] },
  { id: "success", fields: [] },
];

const CONTENT_STEPS = STEPS.filter(
  (s) => s.id !== "intro" && s.id !== "success",
);
const TOTAL = CONTENT_STEPS.length;

// ─── Primitives ───────────────────────────────────────────────────────────────

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-bold tracking-[0.13em] uppercase text-[#8c7e75]"
    >
      {children}
    </label>
  );
}

function StyledInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  autoCapitalize,
  pattern,
  hasError,
  optional,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  autoCapitalize?: string;
  pattern?: string;
  hasError?: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id}>
        {label}
        
      </FieldLabel>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        pattern={pattern}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-[52px] px-4 rounded-xl text-base outline-none transition-colors duration-150",
          "bg-[#ddd8d3] text-[#241f1c] placeholder:text-[#8c7e75]/60",
          "border-2",
          hasError
            ? "border-[#a05a5a]"
            : "border-[#ccc6c0] focus:border-[#3d3530]",
        )}
      />
    </div>
  );
}

function StyledTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        className={cn(
          "w-full px-4 py-3.5 rounded-xl text-base outline-none resize-none transition-colors duration-150",
          "bg-[#ddd8d3] text-[#241f1c] placeholder:text-[#8c7e75]/60 leading-relaxed",
          "border-2",
          hasError
            ? "border-[#a05a5a]"
            : "border-[#ccc6c0] focus:border-[#3d3530]",
        )}
      />
    </div>
  );
}

function OptionButton({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full text-left px-5 py-4 rounded-xl text-base border-2 outline-none cursor-pointer transition-all duration-150",
        selected
          ? "bg-[#241f1c] border-[#241f1c] text-[#ede9e6] font-semibold"
          : "bg-[#ddd8d3] border-[#ccc6c0] text-[#3d3530] font-normal",
      )}
    >
      {label}
    </button>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full h-[3px] rounded-full bg-[#ccc6c0] overflow-hidden">
      <div
        className="h-full bg-[#3d3530] rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function StepShell({
  question,
  hint,
  error,
  children,
}: {
  question: React.ReactNode;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-7 w-full">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-2xl font-extrabold text-[#241f1c] leading-snug tracking-tight m-0">
          {question}
        </h2>
        {hint && <p className="text-sm text-[#8c7e75] m-0">{hint}</p>}
      </div>
      <div className="flex flex-col gap-3">{children}</div>
      {error && <p className="text-sm text-[#a05a5a] -mt-1">{error}</p>}
    </div>
  );
}

function PrimaryButton({
  onClick,
  disabled = false,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full h-14 rounded-2xl font-bold text-base outline-none border-none cursor-pointer",
        "flex items-center justify-center gap-2 transition-opacity duration-150",
        "text-[#ede9e6]",
        disabled
          ? "bg-[#8c7e75] opacity-70 cursor-not-allowed"
          : "bg-[#241f1c] opacity-100",
      )}
    >
      {children}
    </button>
  );
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroCard() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-3xl font-bold text-[#8c7e75]">
          Martina Cordoba
        </p>
        <h1 className="text-xl font-black text-[#241f1c] leading-[1.05] tracking-[-0.03em] m-0">
          Coaching 1:1
        </h1>
      </div>

      <div className="w-10 h-[2px] bg-[#ccc6c0] rounded-full" />

      <div className="flex flex-col gap-2">
        <p className="text-[#5e534c] leading-relaxed text-sm">
          Si estás acá es porque buscás algo más que{" "}
          <em>&apos;moverte&apos;</em>, buscás que
        </p>

        <p className="font-bold text-[#241f1c] leading-snug text-sm">
          el espejo refleje finalmente el esfuerzo que hacés cada día.
        </p>        

        <p className="text-[#5e534c] leading-relaxed text-sm">
          Entiendo que tu vida no se detiene para que entrenes. <br /> Por eso mi
          trabajo es que{" "}
          <strong className="text-[#241f1c] font-bold">
            el plan se adapte a vos y no al revés.
          </strong>
        </p>

        <p className=" text-[#5e534c] leading-relaxed text-sm">
          Si estás dispuesta a comprometerte con tu cambio estético con las
          mismas ganas que yo lo haré con tu planificación,{" "}
          <strong className="text-[#241f1c] font-bold">
            estamos listas para empezar.
          </strong>
        </p>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LeadFormWizard() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [values, setValues] = React.useState<FormValues>(EMPTY);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const currentStep = STEPS[stepIndex];
  const isIntro = currentStep.id === "intro";
  const isSuccess = currentStep.id === "success";
  const contentIndex = CONTENT_STEPS.findIndex((s) => s.id === currentStep.id);
  const progressStep = contentIndex === -1 ? 0 : contentIndex + 1;

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateCurrentStep(): boolean {
    const step = STEPS[stepIndex];
    if (!step.fields.length) return true;
    const partial: Partial<FormValues> = {};
    for (const f of step.fields)
      (partial as Record<string, unknown>)[f] = values[f];
    const result = formSchema.safeParse({ ...EMPTY, ...partial });
    if (result.success) return true;
    const newErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormValues;
      if (step.fields.includes(key) && !newErrors[key])
        newErrors[key] = issue.message;
    }
    if (Object.keys(newErrors).length === 0) return true;
    setErrors(newErrors);
    return false;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setErrors({});
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;
    setServerError(null);
    const result = formSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await createLead(result.data);
      if (error) {
        setServerError(error);
      } else {
        setStepIndex(STEPS.findIndex((s) => s.id === "success"));
      }
    } catch {
      setServerError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  const isLastContentStep =
    currentStep.id === CONTENT_STEPS[CONTENT_STEPS.length - 1].id;

  return (
    <div className="h-dvh flex flex-col bg-[#ede9e6]">
      {/* Top bar */}
      {!isIntro && !isSuccess && (
        <div className="flex items-center gap-4 px-5 pt-5 pb-4 bg-[#ede9e6] sticky top-0 z-10">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#ddd8d3] text-[#5e534c] border-none outline-none cursor-pointer flex-shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <ProgressBar current={progressStep} total={TOTAL} />
          </div>
          <span className="text-xs font-medium text-[#8c7e75] flex-shrink-0 tabular-nums">
            {progressStep}/{TOTAL}
          </span>
        </div>
      )}

      <main className="flex-1 flex flex-col px-5 pb-6">
        {/* ── Intro ── */}
        {isIntro && (
          <div className="flex flex-col justify-between">
            <div className="pt-10">
              <IntroCard />
            </div>
            <div className="pt-10 pb-6 flex flex-col gap-3">
              <PrimaryButton onClick={goNext}>Empezar</PrimaryButton>
              <p className="text-center text-xs text-[#8c7e75] opacity-70 m-0">
                {TOTAL} preguntas · menos de 3 minutos
              </p>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {isSuccess && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#ddd8d3] flex items-center justify-center">
              <Check size={36} strokeWidth={2.5} className="text-[#241f1c]" />
            </div>
            <div className="flex flex-col gap-3">
              <h2 className="text-[2rem] font-black text-[#241f1c] tracking-tight m-0">
                ¡Gracias!
              </h2>
              <p className="text-base text-[#5e534c] leading-relaxed max-w-[280px] mx-auto m-0">
                En breve me estaré contactando contigo por WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* ── Steps ── */}
        {!isIntro && !isSuccess && (
          <div className="flex flex-col justify-between min-h-[calc(100dvh-8rem)]">
            <div>
              {currentStep.id === "personal" && (
                <StepShell
                  question="Primero, contame sobre vos"
                  error={errors.full_name || errors.age || errors.nationality}
                >
                  <StyledInput
                    id="full_name"
                    label="Nombre completo"
                    value={values.full_name}
                    onChange={(v) => set("full_name", v)}
                    placeholder="María García"
                    autoComplete="name"
                    autoCapitalize="words"
                    hasError={!!errors.full_name}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <StyledInput
                      id="age"
                      label="Edad"
                      value={values.age}
                      onChange={(v) =>
                        set("age", v.replace(/\D/g, "").slice(0, 2))
                      }
                      placeholder="28"
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
                      placeholder="Argentina"
                      autoComplete="country-name"
                      autoCapitalize="words"
                      hasError={!!errors.nationality}
                    />
                  </div>
                </StepShell>
              )}

              {currentStep.id === "contact_work" && (
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
                    placeholder="Diseñadora, estudiante, emprendedora..."
                    autoComplete="organization-title"
                    autoCapitalize="words"
                    hasError={!!errors.occupation}
                  />
                  <StyledInput
                    id="whatsapp"
                    label="WhatsApp"
                    value={values.whatsapp}
                    onChange={(v) => set("whatsapp", v)}
                    placeholder="+54 9 11 1234 5678"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    hasError={!!errors.whatsapp}
                  />
                  <StyledInput
                    id="instagram"
                    label="Instagram"
                    value={values.instagram}
                    onChange={(v) => set("instagram", v)}
                    placeholder="@tu_usuario"
                    autoComplete="off"
                    autoCapitalize="none"
                    optional
                  />
                </StepShell>
              )}

              {currentStep.id === "objective" && (
                <StepShell
                  question="¿Cuál es tu objetivo principal?"
                  error={errors.main_objective}
                >
                  {["Aumentar masa muscular", "Disminuir % graso", "Ambas"].map(
                    (opt) => (
                      <OptionButton
                        key={opt}
                        label={opt}
                        selected={values.main_objective === opt}
                        onSelect={() =>
                          set(
                            "main_objective",
                            opt as FormValues["main_objective"],
                          )
                        }
                      />
                    ),
                  )}
                </StepShell>
              )}

              {currentStep.id === "why_me" && (
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
              )}

              {currentStep.id === "importance" && (
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
              )}

              {currentStep.id === "gym_experience" && (
                <StepShell
                  question="¿Cuánta experiencia tenés en el gimnasio?"
                  error={errors.gym_experience}
                >
                  {[
                    "Ninguna",
                    "Menos de 1 año",
                    "1 a 2 años",
                    "+ de 2 años",
                  ].map((opt) => (
                    <OptionButton
                      key={opt}
                      label={opt}
                      selected={values.gym_experience === opt}
                      onSelect={() =>
                        set(
                          "gym_experience",
                          opt as FormValues["gym_experience"],
                        )
                      }
                    />
                  ))}
                </StepShell>
              )}

              {currentStep.id === "commitment_level" && (
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
                              ? "bg-[#241f1c] text-[#ede9e6]"
                              : "bg-[#ddd8d3] text-[#5e534c]",
                          )}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </div>
                </StepShell>
              )}
            </div>

            {/* CTA */}
            <div className="pt-8 pb-6 flex flex-col gap-3">
              {serverError && (
                <p className="text-sm text-[#a05a5a] text-center m-0">
                  {serverError}
                </p>
              )}
              <PrimaryButton
                onClick={isLastContentStep ? handleSubmit : goNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-[#ede9e6]/30 border-t-[#ede9e6] animate-spin" />
                    Enviando...
                  </>
                ) : isLastContentStep ? (
                  "Enviar"
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={16} />
                  </>
                )}
              </PrimaryButton>
            </div>
          </div>
        )}
      </main>

      {!isSuccess && (
        <footer className="px-5 pb-6">
          <p className="text-center text-[0.7rem] text-[#8c7e75] opacity-50 m-0">
            Tu información es privada y no será compartida con terceros.
          </p>
        </footer>
      )}
    </div>
  );
}
