"use client";

import * as React from "react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { EMPTY, FormErrors, formSchema, FormValues } from "../types";
import { createLead } from "../actions";

// ─── Paleta ──────────────────────────────────────────────────────────────────
// #ede9e6  crema cálido (fondo)
// #ddd8d3  greige claro (superficies / inputs)
// #8c7e75  taupe medio (labels, hints)
// #5e534c  taupe oscuro (texto secundario)
// #3d3530  taupe profundo (texto principal)
// #241f1c  casi negro cálido (títulos, CTAs)

const C = {
  bg:        "#ede9e6",
  surface:   "#ddd8d3",
  border:    "#ccc6c0",
  muted:     "#8c7e75",
  secondary: "#5e534c",
  primary:   "#3d3530",
  ink:       "#241f1c",
  cream:     "#ede9e6",
};

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
  { id: "intro",            fields: [] },
  { id: "personal",         fields: ["full_name", "age", "nationality"] },
  { id: "contact_work",     fields: ["occupation", "whatsapp", "instagram"] },
  { id: "objective",        fields: ["main_objective"] },
  { id: "why_me",           fields: ["why_me"] },
  { id: "importance",       fields: ["importance"] },
  { id: "gym_experience",   fields: ["gym_experience"] },
  { id: "commitment_level", fields: ["commitment_level"] },
  { id: "success",          fields: [] },
];

const CONTENT_STEPS = STEPS.filter((s) => s.id !== "intro" && s.id !== "success");
const TOTAL = CONTENT_STEPS.length;

// ─── Primitives ───────────────────────────────────────────────────────────────

function StyledInput({
  id, label, value, onChange, placeholder,
  type = "text", inputMode, autoComplete, autoCapitalize, pattern,
  hasError, optional,
}: {
  id?: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string; autoCapitalize?: string; pattern?: string;
  hasError?: boolean; optional?: boolean;
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: C.muted }}>
        {label}
        {optional && <span style={{ fontWeight: 400, textTransform: "none", opacity: 0.6, marginLeft: 4 }}>(opcional)</span>}
      </label>
      <input
        id={id} type={type} inputMode={inputMode} autoComplete={autoComplete}
        autoCapitalize={autoCapitalize} pattern={pattern} value={value}
        onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", height: "52px", padding: "0 16px", borderRadius: "12px",
          fontSize: "1rem", outline: "none", WebkitAppearance: "none", appearance: "none",
          background: C.surface,
          border: `2px solid ${hasError ? "#a05a5a" : focused ? C.primary : C.border}`,
          color: C.ink, transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

function StyledTextarea({
  id, label, value, onChange, placeholder, hasError,
}: {
  id?: string; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; hasError?: boolean;
}) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label htmlFor={id} style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: C.muted }}>
        {label}
      </label>
      <textarea
        id={id} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={5}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: "12px",
          fontSize: "1rem", outline: "none", resize: "none",
          WebkitAppearance: "none", appearance: "none",
          background: C.surface,
          border: `2px solid ${hasError ? "#a05a5a" : focused ? C.primary : C.border}`,
          color: C.ink, lineHeight: 1.6, transition: "border-color 0.15s",
        }}
      />
    </div>
  );
}

function OptionButton({ label, selected, onSelect }: { label: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      style={{
        width: "100%", textAlign: "left", padding: "16px 20px", borderRadius: "12px",
        fontSize: "1rem", outline: "none", cursor: "pointer",
        background: selected ? C.ink : C.surface,
        border: `2px solid ${selected ? C.ink : C.border}`,
        color: selected ? C.cream : C.primary,
        fontWeight: selected ? 600 : 400,
        transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ width: "100%", height: "3px", borderRadius: "999px", background: C.border, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: C.primary, borderRadius: "999px", transition: "width 0.5s ease-out" }} />
    </div>
  );
}

function StepShell({ question, hint, error, children }: { question: React.ReactNode; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: C.ink, lineHeight: 1.25, letterSpacing: "-0.02em", margin: 0 }}>
          {question}
        </h2>
        {hint && <p style={{ fontSize: "0.875rem", color: C.muted, margin: 0 }}>{hint}</p>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>{children}</div>
      {error && <p style={{ fontSize: "0.875rem", color: "#a05a5a", margin: 0 }}>{error}</p>}
    </div>
  );
}

// ─── Intro ────────────────────────────────────────────────────────────────────

function IntroCard() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: C.muted, marginBottom: "10px", margin: "0 0 10px" }}>
          Martina Córdoba
        </p>
        <h1 style={{ fontSize: "2.75rem", fontWeight: 900, color: C.ink, lineHeight: 1.05, letterSpacing: "-0.03em", margin: 0 }}>
          Coaching<br />
          <span style={{ color: C.primary }}>1:1</span>
        </h1>
      </div>

      <div style={{ width: "40px", height: "2px", background: C.border, borderRadius: "999px" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <p style={{ fontSize: "1.05rem", color: C.secondary, lineHeight: 1.6, margin: 0 }}>
          Si estás acá es porque buscás algo más que <em>&apos;moverte&apos;</em>: buscás que
        </p>

        <div style={{ borderLeft: `3px solid ${C.primary}`, paddingLeft: "16px", paddingTop: "4px", paddingBottom: "4px" }}>
          <p style={{ fontSize: "1.2rem", fontWeight: 700, color: C.ink, lineHeight: 1.35, margin: 0 }}>
            el espejo refleje finalmente el esfuerzo que hacés cada día.
          </p>
        </div>

        <p style={{ fontSize: "1.05rem", color: C.secondary, lineHeight: 1.6, margin: 0 }}>
          Entiendo que tu vida no se detiene para que entrenes. Por eso mi trabajo es que{" "}
          <strong style={{ color: C.ink, fontWeight: 700 }}>el plan se adapte a vos y no al revés.</strong>
        </p>

        <p style={{ fontSize: "1.05rem", color: C.secondary, lineHeight: 1.6, margin: 0 }}>
          Si estás dispuesta a comprometerte con tu cambio estético con las mismas ganas que yo lo haré con tu planificación,{" "}
          <strong style={{ color: C.ink, fontWeight: 700 }}>estamos listas para empezar.</strong>
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {["Personalizado", "Sin excusas", "A tu ritmo"].map((tag) => (
          <span key={tag} style={{ fontSize: "0.75rem", fontWeight: 600, padding: "6px 14px", borderRadius: "999px", background: C.surface, color: C.secondary }}>
            {tag}
          </span>
        ))}
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
    for (const f of step.fields) (partial as Record<string, unknown>)[f] = values[f];
    const result = formSchema.safeParse({ ...EMPTY, ...partial });
    if (result.success) return true;
    const newErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormValues;
      if (step.fields.includes(key) && !newErrors[key]) newErrors[key] = issue.message;
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
      if (error) { setServerError(error); }
      else { setStepIndex(STEPS.findIndex((s) => s.id === "success")); }
    } catch {
      setServerError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  }

  const isLastContentStep = currentStep.id === CONTENT_STEPS[CONTENT_STEPS.length - 1].id;

  const ctaBtn = (label: React.ReactNode, onClick: () => void, disabled = false) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%", height: "56px", borderRadius: "16px", fontWeight: 700, fontSize: "1rem",
        outline: "none", border: "none", cursor: disabled ? "not-allowed" : "pointer",
        background: disabled ? C.muted : C.ink, color: C.cream,
        opacity: disabled ? 0.7 : 1, display: "flex", alignItems: "center",
        justifyContent: "center", gap: "8px", transition: "opacity 0.15s",
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", background: C.bg }}>

      {/* Top bar */}
      {!isIntro && !isSuccess && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px 20px 16px", background: C.bg, position: "sticky", top: 0, zIndex: 10 }}>
          <button
            type="button"
            onClick={goBack}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "999px", background: C.surface, color: C.secondary, border: "none", outline: "none", cursor: "pointer", flexShrink: 0 }}
          >
            <ArrowLeft size={16} />
          </button>
          <div style={{ flex: 1 }}><ProgressBar current={progressStep} total={TOTAL} /></div>
          <span style={{ fontSize: "0.75rem", fontWeight: 500, color: C.muted, flexShrink: 0 }}>
            {progressStep}/{TOTAL}
          </span>
        </div>
      )}

      <main style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 20px" }}>

        {/* ── Intro ── */}
        {isIntro && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "calc(100dvh - 3rem)" }}>
            <div style={{ paddingTop: "40px" }}><IntroCard /></div>
            <div style={{ paddingTop: "40px", paddingBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {ctaBtn("Empezar", goNext)}
              <p style={{ textAlign: "center", fontSize: "0.75rem", color: C.muted, opacity: 0.7, margin: 0 }}>
                {TOTAL} preguntas · menos de 3 minutos
              </p>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {isSuccess && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100dvh - 4rem)", textAlign: "center", gap: "24px" }}>
            <div style={{ width: "80px", height: "80px", borderRadius: "999px", background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Check size={36} strokeWidth={2.5} style={{ color: C.ink }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: 900, color: C.ink, letterSpacing: "-0.02em", margin: 0 }}>¡Gracias!</h2>
              <p style={{ fontSize: "1rem", color: C.secondary, lineHeight: 1.6, maxWidth: "280px", margin: "0 auto" }}>
                Recibimos tu información. En breve nos ponemos en contacto con vos por WhatsApp.
              </p>
            </div>
          </div>
        )}

        {/* ── Steps ── */}
        {!isIntro && !isSuccess && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "calc(100dvh - 8rem)" }}>
            <div>
              {currentStep.id === "personal" && (
                <StepShell question="Primero, contanos sobre vos" error={errors.full_name || errors.age || errors.nationality}>
                  <StyledInput id="full_name" label="Nombre completo" value={values.full_name} onChange={(v) => set("full_name", v)} placeholder="María García" autoComplete="name" autoCapitalize="words" hasError={!!errors.full_name} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <StyledInput id="age" label="Edad" value={values.age} onChange={(v) => set("age", v.replace(/\D/g, "").slice(0, 2))} placeholder="28" type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" hasError={!!errors.age} />
                    <StyledInput id="nationality" label="Nacionalidad" value={values.nationality} onChange={(v) => set("nationality", v)} placeholder="Argentina" autoComplete="country-name" autoCapitalize="words" hasError={!!errors.nationality} />
                  </div>
                </StepShell>
              )}

              {currentStep.id === "contact_work" && (
                <StepShell question="¿A qué te dedicás y cómo te encontramos?" hint="El WhatsApp es obligatorio. Instagram es opcional." error={errors.occupation || errors.whatsapp}>
                  <StyledInput id="occupation" label="Ocupación" value={values.occupation} onChange={(v) => set("occupation", v)} placeholder="Diseñadora, estudiante, emprendedora..." autoComplete="organization-title" autoCapitalize="words" hasError={!!errors.occupation} />
                  <StyledInput id="whatsapp" label="WhatsApp" value={values.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="+54 9 11 1234 5678" type="tel" inputMode="tel" autoComplete="tel" hasError={!!errors.whatsapp} />
                  <StyledInput id="instagram" label="Instagram" value={values.instagram} onChange={(v) => set("instagram", v)} placeholder="@tu_usuario" autoComplete="off" autoCapitalize="none" optional />
                </StepShell>
              )}

              {currentStep.id === "objective" && (
                <StepShell question="¿Cuál es tu objetivo principal?" error={errors.main_objective}>
                  {["Aumentar masa muscular", "Disminuir % graso", "Ambas"].map((opt) => (
                    <OptionButton key={opt} label={opt} selected={values.main_objective === opt} onSelect={() => set("main_objective", opt as FormValues["main_objective"])} />
                  ))}
                </StepShell>
              )}

              {currentStep.id === "why_me" && (
                <StepShell question="¿Por qué creés que puedo ayudarte?" hint="Contanos qué te motivó a contactarnos." error={errors.why_me}>
                  <StyledTextarea id="why_me" label="Tu respuesta" value={values.why_me} onChange={(v) => set("why_me", v)} placeholder="Escribí tu respuesta acá..." hasError={!!errors.why_me} />
                </StepShell>
              )}

              {currentStep.id === "importance" && (
                <StepShell question="¿Por qué es importante para vos lograrlo?" hint="Sé tan honesta como quieras." error={errors.importance}>
                  <StyledTextarea id="importance" label="Tu respuesta" value={values.importance} onChange={(v) => set("importance", v)} placeholder="Escribí tu respuesta acá..." hasError={!!errors.importance} />
                </StepShell>
              )}

              {currentStep.id === "gym_experience" && (
                <StepShell question="¿Cuánta experiencia tenés en el gimnasio?" error={errors.gym_experience}>
                  {["Ninguna", "Menos de 1 año", "1 a 2 años", "+ de 2 años"].map((opt) => (
                    <OptionButton key={opt} label={opt} selected={values.gym_experience === opt} onSelect={() => set("gym_experience", opt as FormValues["gym_experience"])} />
                  ))}
                </StepShell>
              )}

              {currentStep.id === "commitment_level" && (
                <StepShell question="¿Cuál es tu nivel de compromiso?" hint="1 = mínimo · 10 = máximo" error={errors.commitment_level}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
                      const selected = values.commitment_level === String(n);
                      return (
                        <button
                          key={n}
                          type="button"
                          onClick={() => set("commitment_level", String(n))}
                          style={{
                            height: "64px", borderRadius: "12px", fontSize: "1.125rem", fontWeight: 700,
                            outline: "none", cursor: "pointer", border: "none",
                            background: selected ? C.ink : C.surface,
                            color: selected ? C.cream : C.secondary,
                            transition: "all 0.15s",
                          }}
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
            <div style={{ paddingTop: "32px", paddingBottom: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {serverError && <p style={{ fontSize: "0.875rem", color: "#a05a5a", textAlign: "center", margin: 0 }}>{serverError}</p>}
              {ctaBtn(
                isLoading ? (
                  <>
                    <span style={{ width: "16px", height: "16px", borderRadius: "999px", border: "2px solid rgba(237,233,230,0.3)", borderTopColor: C.cream, display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                    Enviando...
                  </>
                ) : isLastContentStep ? "Enviar" : <><span>Continuar</span><ArrowRight size={16} /></>,
                isLastContentStep ? handleSubmit : goNext,
                isLoading
              )}
            </div>
          </div>
        )}
      </main>

      {!isSuccess && (
        <footer style={{ padding: "0 20px 24px" }}>
          <p style={{ textAlign: "center", fontSize: "0.7rem", color: C.muted, opacity: 0.5, margin: 0 }}>
            Tu información es privada y no será compartida con terceros.
          </p>
        </footer>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}