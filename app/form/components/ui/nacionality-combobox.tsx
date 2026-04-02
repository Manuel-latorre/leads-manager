"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { FieldLabel } from "./field-label";
import { ChevronDown, Check } from "lucide-react";

const COUNTRIES = [
  // Latinoamérica completa
  "Argentina", "Bolivia", "Brasil", "Chile", "Colombia",
  "Costa Rica", "Cuba", "Ecuador", "El Salvador", "Guatemala",
  "Honduras", "México", "Nicaragua", "Panamá", "Paraguay",
  "Perú", "República Dominicana", "Uruguay", "Venezuela",
  "Puerto Rico", "Haiti",
  // Resto del mundo
  "Alemania", "Australia", "Bélgica", "Canadá", "China",
  "Corea del Sur", "España", "Estados Unidos", "Francia",
  "India", "Italia", "Japón", "Marruecos", "Nigeria",
  "Países Bajos", "Polonia", "Portugal", "Reino Unido",
  "Rusia", "Sudáfrica", "Suecia", "Suiza", "Turquía",
  "Ucrania", "Egipto", "Filipinas", "Indonesia", "Irán",
  "Israel", "Tailandia",
].sort((a, b) => a.localeCompare(b, "es"));

export function NationalityCombobox({
  id,
  label,
  value,
  onChange,
  hasError,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(country: string) {
    onChange(country);
    setOpen(false);
    setSearch("");
  }

  function handleTriggerClick() {
    setOpen((prev) => !prev);
    // Si abre, enfocar el input de búsqueda
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      {/* Trigger */}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={handleTriggerClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full h-[52px] px-4 rounded-xl text-base outline-none transition-colors duration-150",
          "bg-card text-foreground",
          "border-2 border-input",
          "flex items-center justify-between gap-2 text-left",
          open && "border-ring ring-2 ring-ring/30",
          hasError && !open && "border-destructive",
          hasError && open && "border-destructive ring-2 ring-destructive/20",
        )}
      >
        <span className={cn(!value && "text-muted-foreground/60 whitespace-nowrap overflow-hidden")}>
          {value || "Seleccione su nacionalidad"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full min-w-[var(--radix-select-trigger-width)]",
            "bg-card border-2 border-input rounded-xl shadow-lg overflow-hidden",
            // Posicionamiento relativo al contenedor
          )}
          style={{
            position: "absolute",
            width: containerRef.current?.offsetWidth,
            top: (containerRef.current?.offsetTop ?? 0) +
              (containerRef.current?.offsetHeight ?? 0) + 4,
            left: containerRef.current?.offsetLeft,
          }}
        >
          {/* Search input */}
          <div className="p-2 border-b border-input">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar país..."
              className={cn(
                "w-full h-9 px-3 rounded-lg text-sm outline-none transition-colors duration-150",
                "bg-background text-foreground placeholder:text-muted-foreground/60",
                "border border-input focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30",
              )}
            />
          </div>

          {/* Lista */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-52 overflow-y-auto py-1"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-2.5 text-sm text-muted-foreground">
                No se encontraron resultados
              </li>
            ) : (
              filtered.map((country) => (
                <li
                  key={country}
                  role="option"
                  aria-selected={value === country}
                  onClick={() => handleSelect(country)}
                  className={cn(
                    "flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100",
                    "hover:bg-accent hover:text-accent-foreground",
                    value === country && "text-ring font-medium",
                  )}
                >
                  {country}
                  {value === country && (
                    <Check className="size-3.5 shrink-0" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}