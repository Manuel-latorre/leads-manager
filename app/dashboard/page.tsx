import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { LeadsClient } from "./components/leads-table";
import { getLeads } from "./actions";

export default async function Page() {

  // AQUÍ es donde ocurre la magia:
  // Llamamos a la base de datos (Supabase) directamente en el servidor.
  const initialData = await getLeads();
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
