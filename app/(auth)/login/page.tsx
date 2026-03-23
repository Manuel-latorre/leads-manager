import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-md">
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-extrabold tracking-tight">
              Iniciar sesión
            </CardTitle>
            <CardDescription>
              Ingresá para gestionar tus leads.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={login} className="space-y-4">
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

              <Button type="submit" className="w-full h-11">
                Log in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}