import { login } from "../actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/app/(auth)/login/login-form";

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
            <LoginForm action={login} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}