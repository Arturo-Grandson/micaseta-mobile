"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  getConsumptionsByUserAndBooth,
  getBoothProducts,
} from "@/services/api";
import { Consumption, Product, FestiveType } from "@/types";
import AddConsumptionModal from "@/components/consumptions/AddConsumptionModal";

export default function ConsumptionsPage() {
  const { user, selectedBoothId } = useAuth();
  const [consumptions, setConsumptions] = useState<Consumption[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id || !selectedBoothId) return;

      setIsLoading(true);
      try {
        const [consumptionsData, productsData] = await Promise.all([
          getConsumptionsByUserAndBooth(user.id, selectedBoothId),
          getBoothProducts(selectedBoothId),
        ]);

        setConsumptions(consumptionsData);
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching consumptions data:", err);
        setError("Error al cargar los datos de consumos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id, selectedBoothId]);

  const refreshConsumptions = async () => {
    if (!user?.id || !selectedBoothId) return;

    try {
      const consumptionsData = await getConsumptionsByUserAndBooth(
        user.id,
        selectedBoothId
      );
      setConsumptions(consumptionsData);
    } catch (err) {
      console.error("Error refreshing consumptions:", err);
    }
  };

  // Agrupar consumos por tipo de festividad y año para mejor visualización
  const groupedConsumptions: { [key: string]: Consumption[] } = {};

  consumptions.forEach((consumption) => {
    // Creamos una clave compuesta con el tipo de festividad y el año
    const key = `${consumption.festiveType}-${consumption.year}`;
    if (!groupedConsumptions[key]) {
      groupedConsumptions[key] = [];
    }
    groupedConsumptions[key].push(consumption);
  });

  // Ordenar grupos por año de más reciente a más antiguo, y luego por tipo de festividad
  const sortedKeys = Object.keys(groupedConsumptions).sort((a, b) => {
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Mis Consumos</h1>
          <Button onClick={() => setIsModalOpen(true)}>Añadir Consumo</Button>
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
        ) : consumptions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No tienes consumos registrados</p>
              <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                Añadir mi primer consumo
              </Button>
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
                      {getFestivityName(festiveType as FestiveType)} {year}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="divide-y divide-gray-200">
                      {groupedConsumptions[key].map((consumption) => (
                        <li key={consumption.id} className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {consumption.product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {consumption.quantity} x{" "}
                                {(() => {
                                  // Tratamos product.price como any para manejar diferentes estructuras
                                  const productPrice = consumption.product
                                    .price as any;
                                  let price = 0;

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
                                  }
                                  // O si es un valor directo
                                  else if (productPrice !== undefined) {
                                    price =
                                      typeof productPrice === "number"
                                        ? productPrice
                                        : typeof productPrice === "string"
                                        ? parseFloat(productPrice)
                                        : 0;
                                  }

                                  return price.toFixed(2);
                                })()}
                                €
                              </p>
                            </div>
                            <span className="font-medium">
                              {(() => {
                                // Convertir quantity a número
                                const quantity =
                                  typeof consumption.quantity === "number"
                                    ? consumption.quantity
                                    : typeof consumption.quantity === "string"
                                    ? parseFloat(consumption.quantity)
                                    : 0;

                                // Tratamos product.price como any para manejar diferentes estructuras
                                const productPrice = consumption.product
                                  .price as any;
                                let price = 0;

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
                                }
                                // O si es un valor directo
                                else if (productPrice !== undefined) {
                                  price =
                                    typeof productPrice === "number"
                                      ? productPrice
                                      : typeof productPrice === "string"
                                      ? parseFloat(productPrice)
                                      : 0;
                                }

                                return (quantity * price).toFixed(2);
                              })()}
                              €
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <span>Total:</span>
                      <span className="font-bold">
                        {groupedConsumptions[key]
                          .reduce((acc, curr) => {
                            // Convertir quantity a número
                            const quantity =
                              typeof curr.quantity === "number"
                                ? curr.quantity
                                : typeof curr.quantity === "string"
                                ? parseFloat(curr.quantity)
                                : 0;

                            // Tratamos product.price como any para manejar diferentes estructuras
                            const productPrice = curr.product.price as any;
                            let price = 0;

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
                            }
                            // O si es un valor directo
                            else if (productPrice !== undefined) {
                              price =
                                typeof productPrice === "number"
                                  ? productPrice
                                  : typeof productPrice === "string"
                                  ? parseFloat(productPrice)
                                  : 0;
                            }

                            return acc + quantity * price;
                          }, 0)
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

      {isModalOpen && (
        <AddConsumptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          products={products}
          userId={user?.id ?? 0}
          boothId={selectedBoothId ?? 0}
          onSuccess={refreshConsumptions}
        />
      )}
    </Layout>
  );
}
