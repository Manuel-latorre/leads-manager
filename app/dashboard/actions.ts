"use server";

import { unstable_cache } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Definida una sola vez, fuera de la función
const getLeadsCached = unstable_cache(
  async (userId: string) => {
    // createClient() acá adentro SÍ funciona porque Next.js
    // provee el contexto de AsyncLocalStorage dentro del cache
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("leads")
      .select(`*, objectives:leads_objectives(*)`)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },
  ["getLeads"],
  { revalidate: 60 * 60 }
);

export async function getLeads() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  return getLeadsCached(user.id); // key real: ["getLeads", "uuid"]
}