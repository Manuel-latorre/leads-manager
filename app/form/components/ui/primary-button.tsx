import { cn } from "@/lib/utils";

export function PrimaryButton({
    onClick,
    disabled = false,
    children,
  }: {
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full h-14 rounded-2xl font-bold text-base outline-none border-none cursor-pointer",
          "flex items-center justify-center gap-2 transition-opacity duration-150",
          "text-primary-foreground",
          disabled
            ? "bg-muted text-muted-foreground opacity-70 cursor-not-allowed"
            : "bg-primary opacity-100",
        )}
      >
        {children}
      </button>
    );
  }