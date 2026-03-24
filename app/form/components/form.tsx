"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  IntroStep,
  SuccessStep,
  PersonalStep,
  ContactWorkStep,
  ObjectiveStep,
  WhyMeStep,
  ImportanceStep,
  GymExperienceStep,
  CommitmentLevelStep,
} from "@/app/form/components/steps";
import { ProgressBar } from "./ui/progress-bar";
import { TOTAL, useFormWizard } from "@/app/form/hooks/use-form-wizard";
import { PrimaryButton } from "./ui/primary-button";

// ─── Step renderer ────────────────────────────────────────────────────────────
// Mapping explícito: cada id apunta a su componente.
// Si el id no tiene campos propios (intro/success) se maneja arriba en el shell.

function StepContent({
  stepId,
  values,
  errors,
  set,
}: {
  stepId: string;
  values: ReturnType<typeof useFormWizard>["values"];
  errors: ReturnType<typeof useFormWizard>["errors"];
  set: ReturnType<typeof useFormWizard>["setField"];
}) {
  const props = { values, errors, set };
  switch (stepId) {
    case "personal":
      return <PersonalStep {...props} />;
    case "contact_work":
      return <ContactWorkStep {...props} />;
    case "objective":
      return <ObjectiveStep {...props} />;
    case "why_me":
      return <WhyMeStep {...props} />;
    case "importance":
      return <ImportanceStep {...props} />;
    case "gym_experience":
      return <GymExperienceStep {...props} />;
    case "commitment_level":
      return <CommitmentLevelStep {...props} />;
    default:
      return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LeadFormWizard() {
  const {
    values,
    errors,
    serverError,
    isLoading,
    currentStep,
    progressStep,
    isLastContentStep,
    isIntro,
    isSuccess,
    setField,
    goNext,
    goBack,
    handleSubmit,
  } = useFormWizard();

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* ── Top bar ── */}
      {!isIntro && !isSuccess && (
        <div className="flex items-center gap-4 px-5 pt-5 pb-4 bg-background sticky top-0 z-10">
          <button
            type="button"
            onClick={goBack}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-card text-foreground/80 border-none outline-none cursor-pointer shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <ProgressBar current={progressStep} total={TOTAL} />
          </div>
          <span className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
            {progressStep}/{TOTAL}
          </span>
        </div>
      )}

      <main className="flex-1 flex flex-col px-5 pb-6">
        {/* ── Intro ── */}
        {isIntro && (
          <div className="flex flex-col justify-between">
            <div className="pt-10">
              <IntroStep />
            </div>
            <div className="pt-10 pb-6">
              <PrimaryButton onClick={goNext}>Empezar</PrimaryButton>
            </div>
          </div>
        )}

        {/* ── Success ── */}
        {isSuccess && <SuccessStep />}

        {/* ── Content steps ── */}
        {!isIntro && !isSuccess && (
          <div className="flex flex-col justify-between min-h-[calc(100dvh-8rem)]">
            <div className="pt-2">
              <StepContent
                stepId={currentStep.id}
                values={values}
                errors={errors}
                set={setField}
              />
            </div>

            {/* ── CTA ── */}
            <div className="pt-8 pb-6 flex flex-col gap-3">
              {serverError && (
                <p className="text-sm text-destructive text-center m-0">
                  {serverError}
                </p>
              )}
              <PrimaryButton
                onClick={isLastContentStep ? handleSubmit : goNext}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
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

      {/* ── Footer ── */}
      {!isSuccess && (
        <footer className="px-5 pb-6">
          <p className="text-center text-[0.7rem] text-muted-foreground opacity-50 m-0">
            Tu información es privada y no será compartida con terceros.
          </p>
        </footer>
      )}
    </div>
  );
}
