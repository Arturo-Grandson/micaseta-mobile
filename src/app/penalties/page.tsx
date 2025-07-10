"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getPenaltiesByUserAndBooth } from "@/services/api";
import { Penalty, FestiveType } from "@/types";
import { FiAlertCircle } from "react-icons/fi";

export default function PenaltiesPage() {
  const { user, selectedBoothId } = useAuth();
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !selectedBoothId) return;

      setIsLoading(true);
      try {
        const penaltiesData = await getPenaltiesByUserAndBooth(
          user.id,
          selectedBoothId
        );
        setPenalties(penaltiesData);
      } catch (err) {
        console.error("Error fetching penalties data:", err);
        setError("Error al cargar los datos de multas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, selectedBoothId]);

  // Agrupar multas por tipo de festividad y año para mejor visualización
  const groupedPenalties: { [key: string]: Penalty[] } = {};

  penalties.forEach((penalty) => {
    // Creamos una clave compuesta con el tipo de festividad y el año
    const key = `${penalty.festiveType}-${penalty.year}`;
    if (!groupedPenalties[key]) {
      groupedPenalties[key] = [];
    }
    groupedPenalties[key].push(penalty);
  });

  // Ordenar grupos por año de más reciente a más antiguo, y luego por tipo de festividad
  const sortedKeys = Object.keys(groupedPenalties).sort((a, b) => {
    const [festiveTypeA, yearA] = a.split("-");
    const [festiveTypeB, yearB] = b.split("-");

    // Primero comparamos por año
    if (yearB !== yearA) {
      return parseInt(yearB) - parseInt(yearA);
    }
    // Si el año es el mismo, comparamos por tipo de festividad
    return festiveTypeA.localeCompare(festiveTypeB);
  });

  // Función para obtener el nombre legible del tipo de festividad
  const getFestivityName = (festiveType: FestiveType) => {
    return festiveType === FestiveType.SJ ? "San Juan" : "Feria";
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Multas</h1>
          <p className="text-gray-500 mt-1">Historial de tus multas</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : penalties.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FiAlertCircle className="mx-auto h-12 w-12 text-green-500" />
              <p className="mt-4 text-lg font-medium">
                ¡No tienes multas pendientes!
              </p>
              <p className="text-gray-500">Sigue así</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedKeys.map((key) => {
              const [festiveType, year] = key.split("-");
              return (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      Multas {getFestivityName(festiveType as FestiveType)}{" "}
                      {year}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200">
                      {groupedPenalties[key].map((penalty) => (
                        <li key={penalty.id} className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{penalty.reason}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(penalty.date).toLocaleDateString()}
                                {" • "}
                                {penalty.festiveType === FestiveType.SJ
                                  ? "San Juan"
                                  : "Feria"}
                              </p>
                            </div>
                            <span className="font-medium text-red-600">
                              {(typeof penalty.amount === "number"
                                ? penalty.amount
                                : typeof penalty.amount === "string"
                                ? parseFloat(penalty.amount)
                                : 0
                              ).toFixed(2)}
                              €
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold text-red-600">
                        {groupedPenalties[key]
                          .reduce(
                            (acc, curr) =>
                              acc +
                              (typeof curr.amount === "number"
                                ? curr.amount
                                : typeof curr.amount === "string"
                                ? parseFloat(curr.amount)
                                : 0),
                            0
                          )
                          .toFixed(2)}
                        €
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
