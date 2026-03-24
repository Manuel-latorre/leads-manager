import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";

export function StyledInput({
    id,
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    inputMode,
    autoComplete,
    autoCapitalize,
    pattern,
    hasError,
  }: {
    id?: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: string;
    autoCapitalize?: string;
    pattern?: string;
    hasError?: boolean;
    optional?: boolean;
  }) {
    return (
      <div className="flex flex-col gap-1.5">
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          pattern={pattern}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full h-[52px] px-4 rounded-xl text-base outline-none transition-colors duration-150",
            "bg-card text-foreground placeholder:text-muted-foreground/60",
            "border-2 border-input focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
            hasError &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
          )}
        />
      </div>
    );
  }