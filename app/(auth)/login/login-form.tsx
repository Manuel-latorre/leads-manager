"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type LoginAction = (formData: FormData) => Promise<void>;

interface LoginFormProps {
  action: LoginAction;
}

export function LoginForm({ action }: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const inFlightRef = React.useRef(false);

  async function guardedAction(formData: FormData) {
    // Drop repeated submits while the previous auth call is still in flight.
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    setIsSubmitting(true);

    try {
      await action(formData);
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form action={guardedAction} className="space-y-4" noValidate>
      <fieldset disabled={isSubmitting} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Contraseña
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-11"
          />
        </div>

        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Ingresando...
            </>
          ) : (
            "Iniciar sesión"
          )}
        </Button>
      </fieldset>

      <p
        aria-live="polite"
        className="min-h-5 text-xs text-muted-foreground"
      >
        {isSubmitting ? "Validando credenciales, esperá un momento..." : ""}
      </p>
    </form>
  );
}
