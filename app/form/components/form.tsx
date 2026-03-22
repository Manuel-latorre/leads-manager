"use client";

import * as React from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMPTY, FormErrors, formSchema, FormValues } from "../types";
import { createLead } from "../actions";

// ─── Types ────────────────────────────────────────────────────────────────────

type StepId =
  | "intro"
  | "name"
  | "age_nationality"
  | "occupation"
  | "contact"
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
  { id: "name", fields: ["full_name"] },
  { id: "age_nationality", fields: ["age", "nationality"] },
  { id: "occupation", fields: ["occupation"] },
  { id: "contact", fields: ["whatsapp", "instagram"] },
  { id: "objective", fields: ["main_objective"] },
  { id: "why_me", fields: ["why_me"] },
  { id: "importance", fields: ["importance"] },
  { id: "gym_experience", fields: ["gym_experience"] },
  { id: "commitment_level", fields: ["commitment_level"] },
  { id: "success", fields: [] },
];

const CONTENT_STEPS = STEPS.filter(
  (s) => s.id !== "intro" && s.id !== "success"
);
const TOTAL = CONTENT_STEPS.length;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStepIndex(id: StepId) {
  return STEPS.findIndex((s) => s.id === id);
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function StyledInput({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  autoCapitalize,
  pattern,
  hasError,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  autoCapitalize?: string;
  pattern?: string;
  hasError?: boolean;
}) {
  return (
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
        "w-full h-14 px-4 rounded-2xl text-base bg-white/5 border-2 outline-none",
        "text-white placeholder:text-white/30 font-light",
        "transition-all duration-200",
        "focus:border-rose-400 focus:bg-white/8",
        hasError ? "border-red-400/80" : "border-white/15"
      )}
    />
  );
}

function StyledTextarea({
  id,
  value,
  onChange,
  placeholder,
  hasError,
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hasError?: boolean;
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className={cn(
        "w-full px-4 py-3.5 rounded-2xl text-base bg-white/5 border-2 outline-none resize-none",
        "text-white placeholder:text-white/30 font-light leading-relaxed",
        "transition-all duration-200",
        "focus:border-rose-400 focus:bg-white/8",
        hasError ? "border-red-400/80" : "border-white/15"
      )}
    />
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
        "w-full text-left px-5 py-4 rounded-2xl border-2 text-base font-light",
        "transition-all duration-150 outline-none",
        selected
          ? "bg-rose-500 border-rose-500 text-white font-medium"
          : "bg-white/5 border-white/15 text-white/70 active:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-rose-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

// ─── Step wrapper ─────────────────────────────────────────────────────────────

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
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-semibold text-white leading-snug tracking-tight">
          {question}
        </h2>
        {hint && (
          <p className="text-sm text-white/40 font-light">{hint}</p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
      {error && (
        <p className="text-sm text-rose-400 font-light -mt-1">{error}</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LeadFormWizard() {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [values, setValues] = React.useState<FormValues>(EMPTY);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [direction, setDirection] = React.useState<"forward" | "back">(
    "forward"
  );

  const currentStep = STEPS[stepIndex];
  const isIntro = currentStep.id === "intro";
  const isSuccess = currentStep.id === "success";

  // Progress: only count content steps
  const contentIndex = CONTENT_STEPS.findIndex(
    (s) => s.id === currentStep.id
  );
  const progressStep = contentIndex === -1 ? 0 : contentIndex + 1;

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateCurrentStep(): boolean {
    const step = STEPS[stepIndex];
    if (!step.fields.length) return true;

    // Partial parse only the fields in this step
    const partial: Partial<FormValues> = {};
    for (const f of step.fields) {
      (partial as Record<string, unknown>)[f] = values[f];
    }

    const result = formSchema.safeParse({ ...EMPTY, ...partial });
    if (result.success) return true;

    const newErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormValues;
      if (step.fields.includes(key) && !newErrors[key]) {
        newErrors[key] = issue.message;
      }
    }

    if (Object.keys(newErrors).length === 0) return true;
    setErrors(newErrors);
    return false;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    setDirection("forward");
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setDirection("back");
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
        setDirection("forward");
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

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-[100dvh] flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(244,63,94,0.18) 0%, transparent 70%), #0a0a0a",
      }}
    >
      {/* Top bar */}
      {!isIntro && !isSuccess && (
        <div className="flex items-center gap-4 px-5 pt-safe pt-5 pb-3">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/8 text-white/60 active:bg-white/15 transition-colors outline-none flex-shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <ProgressBar current={progressStep} total={TOTAL} />
          </div>
          <span className="text-xs text-white/30 font-light tabular-nums flex-shrink-0">
            {progressStep}/{TOTAL}
          </span>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col justify-between px-5 py-8">
        {/* ── Intro ── */}
        {isIntro && (
          <div className="flex flex-col justify-between min-h-[calc(100dvh-4rem)]">
            <div className="flex flex-col gap-8 pt-12">
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-rose-400">
                  Martina Córdoba
                </p>
                <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                  Coaching 1:1
                </h1>
              </div>
              <div className="space-y-4 text-white/55 text-base font-light leading-relaxed">
                <p>
                  Si estás acá es porque buscás algo más que
                  &apos;moverte&apos;: buscás que{" "}
                  <span className="text-white font-medium">
                    el espejo refleje finalmente el esfuerzo que hacés cada día
                  </span>
                  .
                </p>
                <p>
                  Mi trabajo es que{" "}
                  <span className="text-white font-medium">
                    el plan se adapte a vos y no al revés
                  </span>
                  .
                </p>
                <p>
                  Si estás dispuesta a comprometerte con tu cambio, estamos
                  listas para empezar.
                </p>
              </div>
            </div>
            <div className="pb-safe pb-8 pt-12">
              <button
                type="button"
                onClick={goNext}
                className="w-full h-14 rounded-2xl bg-rose-500 text-white font-semibold text-base active:scale-[0.98] transition-transform outline-none"
              >
                Empezar
              </button>
              <p className="text-center text-xs text-white/25 mt-4 font-light">
                Toma solo unos minutos · {TOTAL} preguntas
              </p>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {isSuccess && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
              <Check className="w-9 h-9 text-rose-400" strokeWidth={2} />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                ¡Gracias!
              </h2>
              <p className="text-white/50 font-light text-base leading-relaxed max-w-xs mx-auto">
                Recibimos tu información. En breve nos ponemos en contacto con
                vos por WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* ── Steps ── */}
        {!isIntro && !isSuccess && (
          <div className="flex flex-col justify-between min-h-[calc(100dvh-8rem)]">
            <div className="pt-4">
              {/* NAME */}
              {currentStep.id === "name" && (
                <StepShell
                  question="¿Cuál es tu nombre completo?"
                  error={errors.full_name}
                >
                  <StyledInput
                    id="full_name"
                    value={values.full_name}
                    onChange={(v) => set("full_name", v)}
                    placeholder="María García"
                    autoComplete="name"
                    autoCapitalize="words"
                    hasError={!!errors.full_name}
                  />
                </StepShell>
              )}

              {/* AGE + NATIONALITY */}
              {currentStep.id === "age_nationality" && (
                <StepShell
                  question="¿Cuántos años tenés y de dónde sos?"
                  error={errors.age || errors.nationality}
                >
                  <StyledInput
                    id="age"
                    value={values.age}
                    onChange={(v) =>
                      set("age", v.replace(/\D/g, "").slice(0, 2))
                    }
                    placeholder="Edad  (ej: 28)"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="off"
                    hasError={!!errors.age}
                  />
                  <StyledInput
                    id="nationality"
                    value={values.nationality}
                    onChange={(v) => set("nationality", v)}
                    placeholder="Nacionalidad  (ej: Argentina)"
                    autoComplete="country-name"
                    autoCapitalize="words"
                    hasError={!!errors.nationality}
                  />
                </StepShell>
              )}

              {/* OCCUPATION */}
              {currentStep.id === "occupation" && (
                <StepShell
                  question="¿A qué te dedicás?"
                  error={errors.occupation}
                >
                  <StyledInput
                    id="occupation"
                    value={values.occupation}
                    onChange={(v) => set("occupation", v)}
                    placeholder="Diseñadora, estudiante, emprendedora..."
                    autoComplete="organization-title"
                    autoCapitalize="words"
                    hasError={!!errors.occupation}
                  />
                </StepShell>
              )}

              {/* CONTACT */}
              {currentStep.id === "contact" && (
                <StepShell
                  question="¿Cómo te contactamos?"
                  hint="El WhatsApp es obligatorio. Instagram es opcional."
                  error={errors.whatsapp}
                >
                  <StyledInput
                    id="whatsapp"
                    value={values.whatsapp}
                    onChange={(v) => set("whatsapp", v)}
                    placeholder="WhatsApp  (ej: +54 9 11 1234 5678)"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    hasError={!!errors.whatsapp}
                  />
                  <StyledInput
                    id="instagram"
                    value={values.instagram}
                    onChange={(v) => set("instagram", v)}
                    placeholder="Instagram  (ej: @tu_usuario)"
                    autoComplete="off"
                    autoCapitalize="none"
                  />
                </StepShell>
              )}

              {/* MAIN OBJECTIVE */}
              {currentStep.id === "objective" && (
                <StepShell
                  question="¿Cuál es tu objetivo principal?"
                  error={errors.main_objective}
                >
                  {[
                    "Aumentar masa muscular",
                    "Disminuir % graso",
                    "Ambas",
                  ].map((opt) => (
                    <OptionButton
                      key={opt}
                      label={opt}
                      selected={values.main_objective === opt}
                      onSelect={() =>
                        set(
                          "main_objective",
                          opt as FormValues["main_objective"]
                        )
                      }
                    />
                  ))}
                </StepShell>
              )}

              {/* WHY ME */}
              {currentStep.id === "why_me" && (
                <StepShell
                  question="¿Por qué creés que puedo ayudarte?"
                  hint="Contanos qué te motivó a contactarnos."
                  error={errors.why_me}
                >
                  <StyledTextarea
                    id="why_me"
                    value={values.why_me}
                    onChange={(v) => set("why_me", v)}
                    placeholder="Escribí tu respuesta acá..."
                    hasError={!!errors.why_me}
                  />
                </StepShell>
              )}

              {/* IMPORTANCE */}
              {currentStep.id === "importance" && (
                <StepShell
                  question="¿Por qué es importante para vos lograr este objetivo?"
                  hint="Sé tan honesta como quieras."
                  error={errors.importance}
                >
                  <StyledTextarea
                    id="importance"
                    value={values.importance}
                    onChange={(v) => set("importance", v)}
                    placeholder="Escribí tu respuesta acá..."
                    hasError={!!errors.importance}
                  />
                </StepShell>
              )}

              {/* GYM EXPERIENCE */}
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
                          opt as FormValues["gym_experience"]
                        )
                      }
                    />
                  ))}
                </StepShell>
              )}

              {/* COMMITMENT LEVEL */}
              {currentStep.id === "commitment_level" && (
                <StepShell
                  question="¿Cuál es tu nivel de compromiso?"
                  hint="1 = mínimo · 10 = máximo"
                  error={errors.commitment_level}
                >
                  <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                      const selected = values.commitment_level === String(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() =>
                            set("commitment_level", String(n))
                          }
                          className={cn(
                            "h-16 rounded-2xl text-lg font-semibold border-2 outline-none",
                            "transition-all duration-150",
                            selected
                              ? "bg-rose-500 border-rose-500 text-white scale-[0.96]"
                              : "bg-white/5 border-white/15 text-white/60 active:bg-white/12 active:border-white/30"
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

            {/* Bottom CTA */}
            <div className="pt-8 pb-safe pb-8 space-y-3">
              {serverError && (
                <p className="text-sm text-rose-400 text-center font-light">
                  {serverError}
                </p>
              )}
              <button
                type="button"
                onClick={isLastContentStep ? handleSubmit : goNext}
                disabled={isLoading}
                className={cn(
                  "w-full h-14 rounded-2xl font-semibold text-base outline-none",
                  "transition-all duration-150 active:scale-[0.98]",
                  "flex items-center justify-center gap-2",
                  isLoading
                    ? "bg-rose-500/50 text-white/50 cursor-not-allowed"
                    : "bg-rose-500 text-white"
                )}
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {!isSuccess && (
        <footer className="px-5 pb-safe pb-4">
          <p className="text-center text-xs text-white/20 font-light">
            Tu información es privada y no será compartida con terceros.
          </p>
        </footer>
      )}
    </div>
  );
}