export function ProgressBar({
    current,
    total,
  }: {
    current: number;
    total: number;
  }) {
    const pct = Math.round((current / total) * 100);
    return (
      <div className="w-full h-[3px] rounded-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    );
  }