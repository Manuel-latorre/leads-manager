import { cn } from "@/lib/utils";

export function OptionButton({
    label,
    selected,
    onSelect,
  }: {
    label: string;
    selected: boolean;
    onSelect: () => void;
  }) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "w-full text-left px-5 py-4 rounded-xl text-base border-2 outline-none cursor-pointer transition-all duration-150",
          selected
            ? "bg-foreground border-foreground text-background font-semibold"
            : "bg-card border-input text-foreground font-normal",
        )}
      >
        {label}
      </button>
    );
  }