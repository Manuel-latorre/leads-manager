
export interface LeadObjective {
    id: string;
    lead_id: string;
    main_objective: "Aumentar masa muscular" | "Disminuir % graso" | "Ambas";
    why_me: string;
    importance: string;
    gym_experience: "Ninguna" | "Menos de 1 año" | "1 a 2 años" | "+ de 2 años";
    commitment_level: number;
    created_at: string;
  }
  
  export interface Lead {
    id: string;
    full_name: string;
    age: string;
    nationality: string;
    occupation: string;
    whatsapp: string;
    instagram: string | null;
    created_at: string;
    objectives: LeadObjective[];
  }