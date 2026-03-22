import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        const allowedEmails = ["manuel.latorre11@gmail.com", "martina.cordoba2003@gmail.com"];
        
        if (!allowedEmails.includes(user.email)) {
          await supabase.auth.signOut();
          return NextResponse.redirect(new URL("/form?error=unauthorized", requestUrl.origin));
        }

        const mappedUser = {
          id: user.id,
          email: user.email ?? null,
          name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            (user.email ? user.email.split("@")[0] : null),
          avatar:
            user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null,
        };

        await supabase.from("profiles").upsert(mappedUser, { onConflict: "id" });
      }
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
