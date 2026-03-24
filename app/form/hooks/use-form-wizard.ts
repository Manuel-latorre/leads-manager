import { useReducer, useCallback } from "react";
import { EMPTY, FormErrors, formSchema, FormValues } from "@/schemas/form";
import { createLead } from "@/app/form/actions";

// ─── Steps config ─────────────────────────────────────────────────────────────

export type StepId =
  | "intro"
  | "personal"
  | "contact_work"
  | "objective"
  | "why_me"
  | "importance"
  | "gym_experience"
  | "commitment_level"
  | "success";

export interface Step {
  id: StepId;
  fields: (keyof FormValues)[];
}

export const STEPS: Step[] = [
  { id: "intro",             fields: [] },
  { id: "personal",         fields: ["full_name", "age", "nationality"] },
  { id: "contact_work",     fields: ["occupation", "whatsapp", "instagram"] },
  { id: "objective",        fields: ["main_objective"] },
  { id: "why_me",           fields: ["why_me"] },
  { id: "importance",       fields: ["importance"] },
  { id: "gym_experience",   fields: ["gym_experience"] },
  { id: "commitment_level", fields: ["commitment_level"] },
  { id: "success",          fields: [] },
];

export const CONTENT_STEPS = STEPS.filter(
  (s) => s.id !== "intro" && s.id !== "success",
);
export const TOTAL = CONTENT_STEPS.length;

// ─── State & Actions ──────────────────────────────────────────────────────────

interface WizardState {
  stepIndex: number;
  values: FormValues;
  errors: FormErrors;
  serverError: string | null;
  isLoading: boolean;
}

type WizardAction =
  | { type: "SET_FIELD"; key: keyof FormValues; value: string }
  | { type: "SET_ERRORS"; errors: FormErrors }
  | { type: "CLEAR_ERROR"; key: keyof FormValues }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; message: string };

const initialState: WizardState = {
  stepIndex: 0,
  values: EMPTY,
  errors: {},
  serverError: null,
  isLoading: false,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        values: { ...state.values, [action.key]: action.value },
      };
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "CLEAR_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.key]: undefined },
      };
    case "NEXT_STEP":
      return {
        ...state,
        stepIndex: Math.min(state.stepIndex + 1, STEPS.length - 1),
        errors: {},
      };
    case "PREV_STEP":
      return {
        ...state,
        stepIndex: Math.max(state.stepIndex - 1, 0),
        errors: {},
        serverError: null,
      };
    case "SUBMIT_START":
      return { ...state, isLoading: true, serverError: null };
    case "SUBMIT_SUCCESS":
      return {
        ...state,
        isLoading: false,
        stepIndex: STEPS.findIndex((s) => s.id === "success"),
      };
    case "SUBMIT_ERROR":
      return { ...state, isLoading: false, serverError: action.message };
    default:
      return state;
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFormWizard() {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const currentStep = STEPS[state.stepIndex];
  const contentIndex = CONTENT_STEPS.findIndex((s) => s.id === currentStep.id);
  const progressStep = contentIndex === -1 ? 0 : contentIndex + 1;
  const isLastContentStep =
    currentStep.id === CONTENT_STEPS[CONTENT_STEPS.length - 1].id;

  // Sets a single field value and clears its error
  const setField = useCallback(
    <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
      dispatch({ type: "SET_FIELD", key, value: value as string });
      dispatch({ type: "CLEAR_ERROR", key });
    },
    [],
  );

  // Validates only the fields belonging to the current step
  function validateCurrentStep(): boolean {
    const { fields } = currentStep;
    if (!fields.length) return true;

    const partial: Partial<FormValues> = {};
    for (const f of fields) {
      (partial as Record<string, unknown>)[f] = state.values[f];
    }

    const result = formSchema.safeParse({ ...EMPTY, ...partial });
    if (result.success) return true;

    const newErrors: FormErrors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof FormValues;
      if (fields.includes(key) && !newErrors[key]) {
        newErrors[key] = issue.message;
      }
    }

    if (Object.keys(newErrors).length === 0) return true;
    dispatch({ type: "SET_ERRORS", errors: newErrors });
    return false;
  }

  function goNext() {
    if (!validateCurrentStep()) return;
    dispatch({ type: "NEXT_STEP" });
  }

  function goBack() {
    dispatch({ type: "PREV_STEP" });
  }

  async function handleSubmit() {
    if (!validateCurrentStep()) return;

    const result = formSchema.safeParse(state.values);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      dispatch({ type: "SET_ERRORS", errors: fieldErrors });
      return;
    }

    dispatch({ type: "SUBMIT_START" });
    try {
      const { error } = await createLead(result.data);
      if (error) {
        dispatch({ type: "SUBMIT_ERROR", message: error });
      } else {
        dispatch({ type: "SUBMIT_SUCCESS" });
      }
    } catch {
      dispatch({
        type: "SUBMIT_ERROR",
        message: "Ocurrió un error inesperado. Intentá de nuevo.",
      });
    }
  }

  return {
    // State
    values: state.values,
    errors: state.errors,
    serverError: state.serverError,
    isLoading: state.isLoading,
    // Step metadata
    currentStep,
    progressStep,
    isLastContentStep,
    isIntro: currentStep.id === "intro",
    isSuccess: currentStep.id === "success",
    // Actions
    setField,
    goNext,
    goBack,
    handleSubmit,
  };
}