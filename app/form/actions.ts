"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"
import { formSchema, FormValues } from "./types"

// ─── Schema ───────────────────────────────────────────────────────────────────

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