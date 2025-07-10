"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SelectBoothPage() {
  const { booths, selectBooth, isLoading: authLoading } = useAuth();
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectBooth = async () => {
    if (!selectedBoothId) {
      setError("Por favor, selecciona una caseta");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await selectBooth(selectedBoothId);
    } catch (err: any) {
      console.error("Error selecting booth:", err);
      setError(
        err.response?.data?.message ||
          "Error al seleccionar la caseta. Inténtelo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600">MiCaseta</h1>
          <p className="text-gray-600 mt-2">Selecciona tu caseta</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Seleccionar Caseta</CardTitle>
            <CardDescription>Elige una caseta para continuar</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {authLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-600 border-r-transparent mb-4"></div>
                <p className="text-gray-500">Cargando casetas...</p>
              </div>
            ) : booths.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes casetas asignadas</p>
                <p className="text-gray-400 text-sm mt-2">
                  Contacta con el administrador
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {booths.map((booth) => (
                  <div
                    key={booth.id}
                    className={`p-4 border rounded-md cursor-pointer transition-colors ${
                      selectedBoothId === booth.id
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-primary-300"
                    }`}
                    onClick={() => setSelectedBoothId(booth.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className="font-medium">{booth.name}</h3>
                      </div>
                      <div className="ml-2">
                        <div
                          className={`w-5 h-5 rounded-full border ${
                            selectedBoothId === booth.id
                              ? "border-primary-600 bg-primary-600"
                              : "border-gray-300"
                          }`}
                        >
                          {selectedBoothId === booth.id && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="white"
                              className="w-5 h-5"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={handleSelectBooth}
                  disabled={isLoading || !selectedBoothId}
                  fullWidth
                  className="mt-6"
                >
                  {isLoading ? "Cargando..." : "Continuar"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
