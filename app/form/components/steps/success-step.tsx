export function SuccessStep() {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] text-center gap-6">
        <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
          {/* Using inline SVG to avoid importing lucide here */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-[2rem] font-black text-foreground tracking-tight m-0">
            ¡Gracias!
          </h2>
          <p className="text-base text-foreground/80 leading-relaxed max-w-[280px] mx-auto m-0">
            En breve me estaré contactando contigo por WhatsApp.
          </p>
        </div>
      </div>
    );
  }