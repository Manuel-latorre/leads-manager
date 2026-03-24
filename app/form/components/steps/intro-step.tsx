import { ModeToggle } from "@/components/mode-toggle";

export function IntroStep() {
    return (
      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-bold text-muted-foreground">
              Martina Cordoba
            </p>
            <h1 className="uppercase text-xl font-black text-foreground leading-[1.05] tracking-[-0.03em] m-0">
              Coaching 1:1
            </h1>
          </div>
          <ModeToggle />
        </div>
  
        <div className="w-10 h-[2px] bg-border rounded-full" />
  
        <div className="flex flex-col gap-2">
          <p className="text-foreground leading-relaxed text-sm">
            Si estás acá es porque buscás algo más que{" "}
            <em>&apos;moverte&apos;</em>, buscás que
          </p>
          <p className="font-bold text-foreground leading-snug text-sm">
            el espejo refleje finalmente el esfuerzo que hacés cada día.
          </p>
          <p className="text-foreground leading-relaxed text-sm">
            Entiendo que tu vida no se detiene para que entrenes. <br /> Por eso
            mi trabajo es que{" "}
            <strong className="text-foreground font-bold">
              el plan se adapte a vos y no al revés.
            </strong>
          </p>
          <p className="text-foreground leading-relaxed text-sm">
            Si estás dispuesta a comprometerte con tu cambio estético con las
            mismas ganas que yo lo haré con tu planificación,{" "}
            <strong className="text-foreground font-bold">
              estamos listas para empezar.
            </strong>
          </p>
        </div>
      </div>
    );
  }