import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";

export function StyledTextarea({
    id,
    label,
    value,
    onChange,
    placeholder,
    hasError,
  }: {
    id?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    hasError?: boolean;
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className={cn(
            "w-full px-4 py-3.5 rounded-xl text-base outline-none resize-none transition-colors duration-150",
            "bg-card text-foreground placeholder:text-muted-foreground/60 leading-relaxed",
            "border-2 border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
            hasError &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          )}
        />
      </div>
    );
  }