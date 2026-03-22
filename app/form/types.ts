// ─── Schema ──────────────────────────────────────────────────────────────────

import z from "zod"

export const formSchema = z.object({
    full_name: z.string().min(2, "Ingresá tu nombre completo"),
    age: z
      .string()
      .min(1, "Ingresá tu edad")
      .refine((v) => Number(v) >= 1 && Number(v) <= 80, {
        message: "Edad debe estar entre 1 y 80",
      }),
    nationality: z.string().min(2, "Ingresá tu nacionalidad"),
    occupation: z.string().min(2, "Ingresá tu ocupación"),
    whatsapp: z.string().min(6, "Ingresá un número válido"),
    instagram: z.string().min(1, "Ingresá tu Instagram"),
    main_objective: z.enum(
      ["Aumentar masa muscular", "Disminuir % graso", "Ambas"] as const,
      { error: "Seleccioná un objetivo" }
    ),
    why_me: z.string().min(4, "Contame un poco más"),
    importance: z.string().min(4, "Contame un poco más"),
    gym_experience: z.enum(
      ["Ninguna", "Menos de 1 año", "1 a 2 años", "+ de 2 años"] as const,
      { error: "Seleccioná tu experiencia" }
    ),
    commitment_level: z
      .string()
      .min(1, "Seleccioná tu nivel de compromiso")
      .refine((v) => Number(v) >= 1 && Number(v) <= 10, {
        message: "Debe estar entre 1 y 10",
      }),
  })
  
export type FormValues = z.infer<typeof formSchema>
export type FormErrors = Partial<Record<keyof FormValues, string>>



export const EMPTY: FormValues = {
    full_name: "",
    age: "",
    nationality: "",
    occupation: "",
    whatsapp: "",
    instagram: "",
    main_objective: undefined as unknown as FormValues["main_objective"],
    why_me: "",
    importance: "",
    gym_experience: undefined as unknown as FormValues["gym_experience"],
    commitment_level: "",
  }