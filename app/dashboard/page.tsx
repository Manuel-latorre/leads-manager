import { AppSidebar } from "@/components/app-sidebar";
import { LeadsTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getLeads } from "./actions";

export default async function Page() {
  const leads = await getLeads();

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
          <LeadsTable data={leads} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
