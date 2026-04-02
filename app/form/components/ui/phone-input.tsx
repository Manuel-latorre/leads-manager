"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";
import { ChevronDown, Check } from "lucide-react";

const DIAL_CODES = [
  { country: "Argentina",        code: "+54",   flag: "🇦🇷" },
  { country: "Bolivia",          code: "+591",  flag: "🇧🇴" },
  { country: "Brasil",           code: "+55",   flag: "🇧🇷" },
  { country: "Chile",            code: "+56",   flag: "🇨🇱" },
  { country: "Colombia",         code: "+57",   flag: "🇨🇴" },
  { country: "Costa Rica",       code: "+506",  flag: "🇨🇷" },
  { country: "Cuba",             code: "+53",   flag: "🇨🇺" },
  { country: "Ecuador",          code: "+593",  flag: "🇪🇨" },
  { country: "El Salvador",      code: "+503",  flag: "🇸🇻" },
  { country: "Guatemala",        code: "+502",  flag: "🇬🇹" },
  { country: "Honduras",         code: "+504",  flag: "🇭🇳" },
  { country: "México",           code: "+52",   flag: "🇲🇽" },
  { country: "Nicaragua",        code: "+505",  flag: "🇳🇮" },
  { country: "Panamá",           code: "+507",  flag: "🇵🇦" },
  { country: "Paraguay",         code: "+595",  flag: "🇵🇾" },
  { country: "Perú",             code: "+51",   flag: "🇵🇪" },
  { country: "Rep. Dominicana",  code: "+1809", flag: "🇩🇴" },
  { country: "Uruguay",          code: "+598",  flag: "🇺🇾" },
  { country: "Venezuela",        code: "+58",   flag: "🇻🇪" },
  { country: "Puerto Rico",      code: "+1787", flag: "🇵🇷" },
  { country: "Haití",            code: "+509",  flag: "🇭🇹" },
  { country: "Alemania",         code: "+49",   flag: "🇩🇪" },
  { country: "Australia",        code: "+61",   flag: "🇦🇺" },
  { country: "Canadá",           code: "+1",    flag: "🇨🇦" },
  { country: "China",            code: "+86",   flag: "🇨🇳" },
  { country: "Corea del Sur",    code: "+82",   flag: "🇰🇷" },
  { country: "España",           code: "+34",   flag: "🇪🇸" },
  { country: "Estados Unidos",   code: "+1",    flag: "🇺🇸" },
  { country: "Francia",          code: "+33",   flag: "🇫🇷" },
  { country: "India",            code: "+91",   flag: "🇮🇳" },
  { country: "Italia",           code: "+39",   flag: "🇮🇹" },
  { country: "Japón",            code: "+81",   flag: "🇯🇵" },
  { country: "Marruecos",        code: "+212",  flag: "🇲🇦" },
  { country: "Países Bajos",     code: "+31",   flag: "🇳🇱" },
  { country: "Polonia",          code: "+48",   flag: "🇵🇱" },
  { country: "Portugal",         code: "+351",  flag: "🇵🇹" },
  { country: "Reino Unido",      code: "+44",   flag: "🇬🇧" },
  { country: "Rusia",            code: "+7",    flag: "🇷🇺" },
  { country: "Sudáfrica",        code: "+27",   flag: "🇿🇦" },
  { country: "Suecia",           code: "+46",   flag: "🇸🇪" },
  { country: "Suiza",            code: "+41",   flag: "🇨🇭" },
  { country: "Turquía",          code: "+90",   flag: "🇹🇷" },
  { country: "Ucrania",          code: "+380",  flag: "🇺🇦" },
];

const DEFAULT_DIAL = DIAL_CODES[0]; // Argentina +54

/** Separa un valor tipo "+54 9 11 1234 5678" en { dial, local } */
function parseValue(value: string): { dial: (typeof DIAL_CODES)[number]; local: string } {
  const sorted = [...DIAL_CODES].sort((a, b) => b.code.length - a.code.length);
  const match = sorted.find((d) => value.startsWith(d.code));
  if (match) {
    return { dial: match, local: value.slice(match.code.length).trimStart() };
  }
  return { dial: DEFAULT_DIAL, local: value };
}

export function PhoneInput({
  id,
  label,
  value,
  onChange,
  hasError,
}: {
  id?: string;
  label: string;
  value: string;           // valor completo: "+54 9 11 1234 5678"
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const { dial: initialDial, local: initialLocal } = parseValue(value);
  const [selectedDial, setSelectedDial] = useState(initialDial);
  const [localNumber, setLocalNumber] = useState(initialLocal);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const numberInputRef = useRef<HTMLInputElement>(null);

  const filtered = DIAL_CODES.filter(
    (d) =>
      d.country.toLowerCase().includes(search.toLowerCase()) ||
      d.code.includes(search),
  );

  // Sincronizar hacia afuera cuando cambian partes
  function emit(dial: (typeof DIAL_CODES)[number], local: string) {
    const trimmed = local.trim();
    onChange(trimmed ? `${dial.code} ${trimmed}` : "");
  }

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) setTimeout(() => searchRef.current?.focus(), 0);
  }

  function handleSelect(entry: (typeof DIAL_CODES)[number]) {
    setSelectedDial(entry);
    setOpen(false);
    setSearch("");
    emit(entry, localNumber);
    setTimeout(() => numberInputRef.current?.focus(), 0);
  }

  function handleLocalChange(raw: string) {
    const cleaned = raw.replace(/[^\d\s\-]/g, "");
    setLocalNumber(cleaned);
    emit(selectedDial, cleaned);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      <div
        ref={containerRef}
        className={cn(
          "relative flex w-full h-[52px] rounded-xl",
          "bg-card border-2 transition-colors duration-150",
          hasError ? "border-destructive" : "border-input",
          "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
          hasError && "focus-within:border-destructive focus-within:ring-destructive/20",
        )}
      >
        {/* Selector código país */}
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={toggleOpen}
          className={cn(
            "flex items-center gap-1.5 pl-3 pr-2.5 h-full shrink-0",
            "border-r-2 border-input",
            "hover:bg-accent/50 transition-colors duration-100 rounded-l-[10px]",
            "outline-none focus-visible:bg-accent/50",
          )}
        >
          <span className="text-lg leading-none">{selectedDial.flag}</span>
          <span className="text-sm font-medium text-muted-foreground tabular-nums">
            {selectedDial.code}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform duration-150",
              open && "rotate-180",
            )}
          />
        </button>

        {/* Input número local */}
        <input
          ref={numberInputRef}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={localNumber}
          onChange={(e) => handleLocalChange(e.target.value)}
          placeholder="9 11 1234 5678"
          className="flex-1 min-w-0 h-full px-3 rounded-r-[10px] text-base outline-none bg-transparent text-foreground placeholder:text-muted-foreground/60"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-50 bg-card border-2 border-input rounded-xl shadow-xl overflow-hidden">
            <div className="p-2 border-b border-input">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
                placeholder="Buscar país o código..."
                className={cn(
                  "w-full h-9 px-3 rounded-lg text-sm outline-none transition-colors duration-150",
                  "bg-background text-foreground placeholder:text-muted-foreground/60",
                  "border border-input focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30",
                )}
              />
            </div>
            <ul role="listbox" className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-2.5 text-sm text-muted-foreground">
                  Sin resultados
                </li>
              ) : (
                filtered.map((entry) => (
                  <li
                    key={`${entry.country}-${entry.code}`}
                    role="option"
                    aria-selected={selectedDial.country === entry.country}
                    onClick={() => handleSelect(entry)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedDial.country === entry.country && "text-ring font-medium",
                    )}
                  >
                    <span className="text-base w-5 text-center leading-none">{entry.flag}</span>
                    <span className="flex-1 truncate">{entry.country}</span>
                    <span className="text-muted-foreground tabular-nums text-xs">{entry.code}</span>
                    {selectedDial.country === entry.country && (
                      <Check className="size-3.5 shrink-0 text-ring" />
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}