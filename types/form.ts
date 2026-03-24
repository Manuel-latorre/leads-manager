import { FormErrors, FormValues } from "@/schemas/form";

export interface StepProps {
  values: FormValues;
  errors: FormErrors;
  set: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
}

export const OBJECTIVE_OPTIONS: FormValues["main_objective"][] = [
  "Aumentar masa muscular",
  "Disminuir % graso",
  "Ambas",
];

export const GYM_OPTIONS: FormValues["gym_experience"][] = [
  "Ninguna",
  "Menos de 1 año",
  "1 a 2 años",
  "+ de 2 años",
];
