"use server";

import { createClient } from "@/lib/supabase/server";


export async function getLeads() {
  const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .select(`*, objectives:leads_objectives(*)`)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data;

}