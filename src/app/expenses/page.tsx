"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getCommonExpensesByBooth, getBoothMembersCount } from "@/services/api";
import { CommonExpense, FestiveType } from "@/types";
import { FiDollarSign } from "react-icons/fi";

export default function ExpensesPage() {
  const { selectedBoothId } = useAuth();
  const [expenses, setExpenses] = useState<CommonExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [membersCount, setMembersCount] = useState(5); // Valor predeterminado

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedBoothId) return;

      setIsLoading(true);
      try {
        // Cargar los gastos
        const expensesData = await getCommonExpensesByBooth(selectedBoothId);
        setExpenses(expensesData);

        // Cargar el número de miembros de la caseta
        try {
          const count = await getBoothMembersCount(selectedBoothId);
          setMembersCount(count);
        } catch (err) {
          console.error("Error al obtener el número de miembros:", err);
          // Mantenemos el valor predeterminado si hay error
        }
      } catch (err) {
        console.error("Error fetching expenses data:", err);
        setError("Error al cargar los datos de gastos comunes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedBoothId]);

  // Agrupar gastos por tipo de festividad y año para mejor visualización
  const groupedExpenses: { [key: string]: CommonExpense[] } = {};

  expenses.forEach((expense) => {
    // Creamos una clave compuesta con el tipo de festividad y el año
    const key = `${expense.festiveType}-${expense.year}`;
    if (!groupedExpenses[key]) {
      groupedExpenses[key] = [];
    }
    groupedExpenses[key].push(expense);
  });

  // Ordenar grupos por año de más reciente a más antiguo, y luego por tipo de festividad
  const sortedKeys = Object.keys(groupedExpenses).sort((a, b) => {
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
          <h1 className="text-2xl font-bold text-gray-900">Gastos Comunes</h1>
          <p className="text-gray-500 mt-1">Historial de gastos de la caseta</p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : Object.keys(groupedExpenses).length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <FiDollarSign className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-lg font-medium">
                No hay gastos comunes registrados
              </p>
              <p className="text-gray-500">No se encontraron gastos</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sortedKeys.map((key) => {
              const [festiveType, year] = key.split("-");
              const expensesInGroup = groupedExpenses[key];

              return (
                <Card key={key}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {getFestivityName(festiveType as FestiveType)} {year}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200">
                      {expensesInGroup.map((expense) => (
                        <li key={expense.id} className="py-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {expense.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">
                                {(typeof expense.totalAmount === "number"
                                  ? expense.totalAmount
                                  : typeof expense.totalAmount === "string"
                                  ? parseFloat(expense.totalAmount)
                                  : 0
                                ).toFixed(2)}
                                €
                              </span>
                              <p className="text-xs text-gray-500">
                                Tu parte:{" "}
                                {(
                                  (typeof expense.totalAmount === "number"
                                    ? expense.totalAmount
                                    : typeof expense.totalAmount === "string"
                                    ? parseFloat(expense.totalAmount)
                                    : 0) / membersCount
                                ).toFixed(2)}
                                €
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span>Total gastos:</span>
                        <span className="font-bold">
                          {expensesInGroup
                            .reduce(
                              (acc, curr) =>
                                acc +
                                (typeof curr.totalAmount === "number"
                                  ? curr.totalAmount
                                  : typeof curr.totalAmount === "string"
                                  ? parseFloat(curr.totalAmount)
                                  : 0),
                              0
                            )
                            .toFixed(2)}
                          €
                        </span>
                      </div>

                      <div className="flex justify-between mt-2 text-sm text-primary-600">
                        <span>
                          Tu parte ({(100 / membersCount).toFixed(0)}%):
                        </span>
                        <span className="font-bold">
                          {(
                            expensesInGroup.reduce(
                              (acc, curr) =>
                                acc +
                                (typeof curr.totalAmount === "number"
                                  ? curr.totalAmount
                                  : typeof curr.totalAmount === "string"
                                  ? parseFloat(curr.totalAmount)
                                  : 0),
                              0
                            ) / membersCount
                          ).toFixed(2)}
                          €
                        </span>
                      </div>
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
