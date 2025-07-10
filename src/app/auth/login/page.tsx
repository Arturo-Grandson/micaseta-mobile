"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError("");

    try {
      await login(data.email, data.password);
    } catch (err: any) {
      console.error("Error during login:", err);
      if (err.response?.status === 401) {
        setError(
          "Credenciales incorrectas. Por favor, verifica tu email y contraseña."
        );
      } else if (err.response?.status === 429) {
        setError("Demasiados intentos fallidos. Por favor, intenta más tarde.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión. Inténtelo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">MiCaseta</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder a tu cuenta
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="tu@email.com"
                  error={errors.email?.message}
                  fullWidth
                  {...register("email")}
                />

                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  fullWidth
                  {...register("password")}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={isLoading} fullWidth>
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
