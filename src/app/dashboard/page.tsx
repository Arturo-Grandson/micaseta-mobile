"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  getConsumptionsByUserAndBooth,
  getPenaltiesByUserAndBooth,
  getCommonExpensesByBoothAndYear,
  getBoothMembersCount,
} from "@/services/api";
import { FestiveType, Consumption, Penalty, CommonExpense } from "@/types";

export default function DashboardPage() {
  const { user, selectedBoothId } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    consumptions: { total: 0, count: 0 },
    penalties: { total: 0, count: 0 },
    expenses: { total: 0, count: 0, userShare: 0, membersCount: 0 },
  });
  const [error, setError] = useState("");
  const currentYear = new Date().getFullYear();
  const festiveType = FestiveType.SJ; // Podríamos permitir seleccionar el tipo de festividad

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !selectedBoothId) {
        console.log("No hay usuario o caseta seleccionada");
        setError("Necesitas estar autenticado y tener una caseta seleccionada");
        setIsLoading(false);
        return;
      }

      console.log(
        `Cargando datos para usuario ${user.id} y caseta ${selectedBoothId}`
      );
      setIsLoading(true);
      setError(""); // Limpiamos cualquier error previo

      try {
        // Cargamos los datos de forma independiente para manejar mejor los errores
        let consumptions: Consumption[] = [];
        let penalties: Penalty[] = [];
        let expenses: CommonExpense[] = [];

        try {
          consumptions = await getConsumptionsByUserAndBooth(
            user.id,
            selectedBoothId
          );
          console.log("Consumos obtenidos:", consumptions);
        } catch (err) {
          console.error("Error al obtener consumos:", err);
        }

        try {
          penalties = await getPenaltiesByUserAndBooth(
            user.id,
            selectedBoothId
          );
          console.log("Multas obtenidas:", penalties);
        } catch (err) {
          console.error("Error al obtener multas:", err);
        }

        // Obtener el número de miembros de la caseta
        let membersCount = 5; // Valor predeterminado
        try {
          membersCount = await getBoothMembersCount(selectedBoothId);
          console.log("Número de miembros de la caseta:", membersCount);
        } catch (err) {
          console.error("Error al obtener el número de miembros:", err);
        }

        try {
          expenses = await getCommonExpensesByBoothAndYear(
            selectedBoothId,
            currentYear
          );
          console.log("Gastos comunes obtenidos:", expenses);
        } catch (err) {
          console.error("Error al obtener gastos comunes:", err);
        }

        // Calcular estadísticas de consumos
        const consumptionsTotal = consumptions.reduce((acc, item) => {
          console.log("Procesando item de consumo:", item);

          // Manejar la estructura anidada del precio
          let price = 0;
          if (item.product) {
            // Tratamos product.price como any para manejar diferentes estructuras
            const productPrice = item.product.price as any;

            // Verificar si el precio es un objeto con su propio campo price
            if (
              productPrice &&
              typeof productPrice === "object" &&
              "price" in productPrice
            ) {
              const priceValue = productPrice.price;
              price =
                typeof priceValue === "number"
                  ? priceValue
                  : typeof priceValue === "string"
                  ? parseFloat(priceValue)
                  : 0;
              console.log("Precio obtenido de objeto anidado:", price);
            }
            // O si es un valor directo
            else if (productPrice !== undefined) {
              price =
                typeof productPrice === "number"
                  ? productPrice
                  : typeof productPrice === "string"
                  ? parseFloat(productPrice)
                  : 0;
              console.log("Precio obtenido directamente:", price);
            }
          }

          // Convertir quantity a número si es una cadena, o usar 0 si no es ni número ni cadena
          const quantity =
            typeof item.quantity === "number"
              ? item.quantity
              : typeof item.quantity === "string"
              ? parseFloat(item.quantity)
              : 0;

          const result = acc + price * quantity;
          console.log(
            `Item: ${
              item.product?.name
            }, Price: ${price}, Quantity: ${quantity}, Subtotal: ${
              price * quantity
            }, Running total: ${result}`
          );
          return result;
        }, 0);

        // Calcular estadísticas de multas
        const penaltiesTotal = penalties.reduce((acc, item) => {
          // Convertir amount a número si es una cadena
          const amount =
            typeof item.amount === "number"
              ? item.amount
              : typeof item.amount === "string"
              ? parseFloat(item.amount)
              : 0;
          return acc + amount;
        }, 0);

        // Calcular estadísticas de gastos comunes
        const expensesTotal = expenses.reduce((acc, item) => {
          // Convertir totalAmount a número si es una cadena
          const totalAmount =
            typeof item.totalAmount === "number"
              ? item.totalAmount
              : typeof item.totalAmount === "string"
              ? parseFloat(item.totalAmount)
              : 0;
          return acc + totalAmount;
        }, 0);

        // Calcular la parte proporcional de los gastos comunes que corresponde al usuario
        const userExpensesShare =
          membersCount > 0 ? expensesTotal / membersCount : 0;

        setStats({
          consumptions: {
            total: consumptionsTotal,
            count: consumptions.length,
          },
          penalties: {
            total: penaltiesTotal,
            count: penalties.length,
          },
          expenses: {
            total: expensesTotal,
            count: expenses.length,
            userShare: userExpensesShare,
            membersCount: membersCount,
          },
        });

        console.log("Datos del dashboard cargados correctamente");
      } catch (err) {
        console.error("Error general al cargar datos del dashboard:", err);
        setError(
          "Error al cargar los datos del dashboard. Por favor, intenta de nuevo."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, selectedBoothId, currentYear]);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Bienvenido, {user?.name}! Aquí tienes un resumen de tu actividad.
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">{error}</div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Consumos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold">
                      {(typeof stats.consumptions.total === "number"
                        ? stats.consumptions.total
                        : 0
                      ).toFixed(2)}
                      €
                    </span>
                    <span className="text-sm text-gray-500">
                      {stats.consumptions.count} consumos
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Multas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-bold">
                      {(typeof stats.penalties.total === "number"
                        ? stats.penalties.total
                        : 0
                      ).toFixed(2)}
                      €
                    </span>
                    <span className="text-sm text-gray-500">
                      {stats.penalties.count} multas
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Gastos Comunes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <span className="text-2xl font-bold">
                        {(typeof stats.expenses.userShare === "number"
                          ? stats.expenses.userShare
                          : 0
                        ).toFixed(2)}
                        €
                      </span>
                      <p className="text-xs text-gray-500">
                        Tu parte (
                        {(100 / stats.expenses.membersCount).toFixed(0)}%)
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">
                        {stats.expenses.count} gastos
                      </span>
                      <p className="text-xs text-gray-500">
                        Total:{" "}
                        {(typeof stats.expenses.total === "number"
                          ? stats.expenses.total
                          : 0
                        ).toFixed(2)}
                        €
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen {currentYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-primary-100 text-primary-600">
                        Total
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary-600">
                        {(
                          (typeof stats.consumptions.total === "number"
                            ? stats.consumptions.total
                            : 0) +
                          (typeof stats.penalties.total === "number"
                            ? stats.penalties.total
                            : 0) +
                          (typeof stats.expenses.userShare === "number"
                            ? stats.expenses.userShare
                            : 0)
                        ).toFixed(2)}
                        €
                      </span>
                    </div>
                  </div>
                  <div className="flex h-4 mb-4 overflow-hidden rounded-full bg-gray-200">
                    {(() => {
                      // Asegurarse de que todos los valores sean números
                      const consumptionsTotal =
                        typeof stats.consumptions.total === "number"
                          ? stats.consumptions.total
                          : 0;
                      const penaltiesTotal =
                        typeof stats.penalties.total === "number"
                          ? stats.penalties.total
                          : 0;
                      const expensesShare =
                        typeof stats.expenses.userShare === "number"
                          ? stats.expenses.userShare
                          : 0;
                      const total =
                        consumptionsTotal + penaltiesTotal + expensesShare;

                      return (
                        <>
                          {consumptionsTotal > 0 && (
                            <div
                              style={{
                                width: `${
                                  total > 0
                                    ? (consumptionsTotal / total) * 100
                                    : 0
                                }%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-primary-500"
                            ></div>
                          )}
                          {penaltiesTotal > 0 && (
                            <div
                              style={{
                                width: `${
                                  total > 0 ? (penaltiesTotal / total) * 100 : 0
                                }%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-red-500"
                            ></div>
                          )}
                          {expensesShare > 0 && (
                            <div
                              style={{
                                width: `${
                                  total > 0 ? (expensesShare / total) * 100 : 0
                                }%`,
                              }}
                              className="flex flex-col justify-center text-center text-white bg-yellow-500"
                            ></div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex text-xs justify-between">
                    <span className="text-primary-500">
                      Consumos:{" "}
                      {(typeof stats.consumptions.total === "number"
                        ? stats.consumptions.total
                        : 0
                      ).toFixed(2)}
                      €
                    </span>
                    <span className="text-red-500">
                      Multas:{" "}
                      {(typeof stats.penalties.total === "number"
                        ? stats.penalties.total
                        : 0
                      ).toFixed(2)}
                      €
                    </span>
                    <span className="text-yellow-500">
                      Tu parte de gastos comunes:{" "}
                      {(typeof stats.expenses.userShare === "number"
                        ? stats.expenses.userShare
                        : 0
                      ).toFixed(2)}
                      € ({(100 / stats.expenses.membersCount).toFixed(0)}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}
