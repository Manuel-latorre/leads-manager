import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/form");
  }

  const allowedEmails = ["manuel.latorre11@gmail.com", "martina.cordoba2003@gmail.com"];
  
  if (!allowedEmails.includes(user.email)) {
    redirect("/form");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">Bienvenido, {user.email}</p>
        </div>
      </div>
    </div>
  );
}