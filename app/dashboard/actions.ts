"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getLeads() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select(
      `
      *,
      objectives:leads_objectives(*)
    `,
    )
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }


  return data;
}
