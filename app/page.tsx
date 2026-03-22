import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowedEmails = ["manuel.latorre11@gmail.com", "martina.cordoba2003@gmail.com"];

  if (user?.email && allowedEmails.includes(user.email)) {
    redirect("/dashboard");
  }

  redirect("/form");
}