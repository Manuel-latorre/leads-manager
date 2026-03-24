"use client"

import useSWR from "swr";
import { LeadsTable } from "@/components/data-table";
import { getLeads } from "../actions";
import { Lead } from "@/types/leads";
// Importamos la interface

interface LeadsClientProps {
  initialData: Lead[]; 
}

export function LeadsClient({ initialData }: LeadsClientProps) {
  // SWR ahora sabe exactamente qué forma tiene 'data'
  const { data } = useSWR<Lead[]>('leads_list', getLeads, { 
    fallbackData: initialData,
    revalidateOnMount: false 
  });

  return (
    <div className="flex flex-1 flex-col">
      {/* Si data es undefined (muy raro con fallbackData), 
         pasamos array vacío que ahora coincide con Lead[] 
      */}
      <LeadsTable data={data ?? []} />
    </div>
  );
}