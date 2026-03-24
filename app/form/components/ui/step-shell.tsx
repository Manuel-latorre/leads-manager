
export function StepShell({
    question,
    hint,
    error,
    children,
  }: {
    question: React.ReactNode;
    hint?: string;
    error?: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex flex-col gap-7 w-full">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-extrabold text-foreground leading-snug tracking-tight m-0">
            {question}
          </h2>
          {hint && <p className="text-sm text-muted-foreground m-0">{hint}</p>}
        </div>
        <div className="flex flex-col gap-3">{children}</div>
        {error && <p className="text-sm text-destructive -mt-1">{error}</p>}
      </div>
    );
  }