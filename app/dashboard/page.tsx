import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LeadsClient } from "./components/leads-table";
import { getLeads } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Page() {

  // AQUÍ es donde ocurre la magia:
  // Llamamos a la base de datos (Supabase) directamente en el servidor.
  const initialData = await getLeads();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const allowedEmails =
  process.env.ALLOWED_EMAILS?.toLowerCase().split(",").map((e) => e.trim()) ?? [];

if (!user?.email || !allowedEmails.includes(user.email.toLowerCase())) {
  redirect("/form");
}

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          {/* Ahora 'initialData' ya viene con los leads reales de la DB */}
          <LeadsClient initialData={initialData} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
