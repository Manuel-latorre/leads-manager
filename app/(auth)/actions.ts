"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const headerList = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? headerList.get("origin");

  if (!origin) {
    redirect("/?error=missing_site_url");
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/?error=oauth_start_failed");
  }

  redirect(data.url);
}
