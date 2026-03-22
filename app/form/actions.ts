"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// ─── Schema ───────────────────────────────────────────────────────────────────

const formSchema = z.object({
  full_name: z.string().min(2),
  age: z
    .string()
    .refine((v) => Number(v) >= 14 && Number(v) <= 80),
  nationality: z.string().min(2),
  occupation: z.string().min(2),
  whatsapp: z.string().min(6),
  instagram: z.string().min(1),
  main_objective: z.enum([
    "Aumentar masa muscular",
    "Disminuir % graso",
    "Ambas",
  ] as const),
  why_me: z.string().min(10),
  importance: z.string().min(10),
  gym_experience: z.enum([
    "Ninguna",
    "Menos de 1 año",
    "1 a 2 años",
    "+ de 2 años",
  ] as const),
  commitment_level: z
    .string()
    .refine((v) => Number(v) >= 1 && Number(v) <= 10),
})

type FormValues = z.infer<typeof formSchema>

// ─── Action ───────────────────────────────────────────────────────────────────

export async function createLead(values: FormValues): Promise<{ error?: string }> {
  // Validate on server too — never trust the client
  const result = formSchema.safeParse(values)
  if (!result.success) {
    return { error: "Datos inválidos. Revisá el formulario." }
  }

  const supabase = await createClient()

  const {
    full_name,
    age,
    nationality,
    occupation,
    whatsapp,
    instagram,
    main_objective,
    why_me,
    importance,
    gym_experience,
    commitment_level,
  } = result.data

  // 1. Insert lead
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      full_name,
      age: Number(age),
      nationality,
      occupation,
      whatsapp,
      instagram,
    })
    .select("id")
    .single()

  if (leadError || !lead) {
    console.error("[createLead] leads insert error:", leadError)
    return { error: "No se pudo guardar tu información. Intentá de nuevo." }
  }

  // 2. Insert objectives linked to the lead
  const { error: objectivesError } = await supabase
    .from("leads_objectives")
    .insert({
      lead_id: lead.id,
      main_objective,
      why_me,
      importance,
      gym_experience,
      commitment_level: Number(commitment_level),
    })

  if (objectivesError) {
    console.error("[createLead] leads_objectives insert error:", objectivesError)
    // Roll back the lead row to avoid orphaned records
    await supabase.from("leads").delete().eq("id", lead.id)
    return { error: "No se pudo guardar tu información. Intentá de nuevo." }
  }

  return {}
}