import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX, FiPlus, FiMinus } from "react-icons/fi";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Product, FestiveType, CreateConsumptionRequest } from "@/types";
import { createConsumption } from "@/services/api";

interface AddConsumptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  userId: number;
  boothId: number;
  onSuccess: () => void;
}

type ProductItem = {
  productId: number;
  quantity: number;
  productName: string;
  productPrice: number;
};

const AddConsumptionModal = ({
  isOpen,
  onClose,
  products,
  userId,
  boothId,
  onSuccess,
}: AddConsumptionModalProps) => {
  const [selectedProducts, setSelectedProducts] = useState<ProductItem[]>([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addProduct = (product: Product) => {
    const existingIndex = selectedProducts.findIndex(
      (p) => p.productId === product.id
    );

    // Tratamos product.price como any para manejar diferentes estructuras
    const rawPrice = product.price as any;
    let productPrice = 0;

    // Verificar si el precio es un objeto con su propio campo price
    if (rawPrice && typeof rawPrice === "object" && "price" in rawPrice) {
      const priceValue = rawPrice.price;
      productPrice =
        typeof priceValue === "number"
          ? priceValue
          : typeof priceValue === "string"
          ? parseFloat(priceValue)
          : 0;
      console.log("Modal - Precio obtenido de objeto anidado:", productPrice);
    }
    // O si es un valor directo
    else if (rawPrice !== undefined) {
      productPrice =
        typeof rawPrice === "number"
          ? rawPrice
          : typeof rawPrice === "string"
          ? parseFloat(rawPrice)
          : 0;
      console.log("Modal - Precio obtenido directamente:", productPrice);
    }

    if (existingIndex >= 0) {
      // Si el producto ya está seleccionado, aumentar la cantidad
      const updated = [...selectedProducts];
      updated[existingIndex].quantity += 1;
      setSelectedProducts(updated);
    } else {
      // Si no, añadirlo con cantidad 1
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: product.id,
          quantity: 1,
          productName: product.name,
          productPrice: productPrice, // Usamos el valor convertido
        },
      ]);
    }
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updated = [...selectedProducts];
    updated[index].quantity = newQuantity;
    setSelectedProducts(updated);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      setError("Debes seleccionar al menos un producto");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const request: CreateConsumptionRequest = {
        userId,
        boothId,
        festiveType: FestiveType.SJ, // Podría ser seleccionable
        year: new Date().getFullYear(),
        date: new Date(),
        items: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      };

      await createConsumption(request);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error creating consumption:", err);
      setError(err.response?.data?.message || "Error al crear el consumo");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const calculateTotal = () => {
    return selectedProducts.reduce(
      (acc, item) =>
        acc +
        (typeof item.quantity === "number"
          ? item.quantity
          : typeof item.quantity === "string"
          ? parseFloat(item.quantity)
          : 0) *
          (typeof item.productPrice === "number"
            ? item.productPrice
            : typeof item.productPrice === "string"
            ? parseFloat(item.productPrice)
            : 0),
      0
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Añadir Consumo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
              {error}
            </div>
          )}

          <div className="mb-4">
            <h3 className="font-medium mb-2">Productos disponibles</h3>
            <div className="grid grid-cols-2 gap-2">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addProduct(product)}
                  className="border border-gray-200 rounded-md p-2 hover:bg-primary-50 hover:border-primary-500 text-left transition-colors"
                >
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    {(typeof product.price === "number"
                      ? product.price
                      : typeof product.price === "string"
                      ? parseFloat(product.price)
                      : 0
                    ).toFixed(2)}
                    €
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Productos seleccionados</h3>
            {selectedProducts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No has seleccionado ningún producto
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {selectedProducts.map((item, index) => (
                  <li key={index} className="py-3 flex items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {(typeof item.productPrice === "number"
                          ? item.productPrice
                          : typeof item.productPrice === "string"
                          ? parseFloat(item.productPrice)
                          : 0
                        ).toFixed(2)}
                        € cada uno
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="p-1 text-gray-500 hover:text-primary-600"
                      >
                        <FiMinus className="w-4 h-4" />
                      </button>
                      <span className="mx-2 min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="p-1 text-gray-500 hover:text-primary-600"
                      >
                        <FiPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeProduct(index)}
                        className="ml-3 p-1 text-red-500 hover:text-red-700"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {selectedProducts.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">
                  {(typeof calculateTotal() === "number"
                    ? calculateTotal()
                    : 0
                  ).toFixed(2)}
                  €
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedProducts.length === 0}
          >
            {isSubmitting ? "Guardando..." : "Guardar Consumo"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddConsumptionModal;
