import axios from "axios";
import Cookies from "js-cookie";
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  SelectBoothRequest,
  SelectBoothResponse,
  User,
  Booth,
  Consumption,
  Penalty,
  CommonExpense,
  CreateConsumptionRequest,
  CreatePenaltyRequest,
  CreateCommonExpenseRequest,
} from "@/types";

// URL del servidor NestJS
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Importante para cookies de autenticación
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Funciones de autenticación
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    // Aseguramos que siempre enviamos el boothId=1 para simplificar el flujo
    const loginData = {
      ...credentials,
      boothId: 1, // Forzamos a usar el boothId 1 para pruebas
    };

    console.log("Intentando iniciar sesión con:", loginData);
    const response = await api.post<any>("/auth/login", loginData);
    console.log("Respuesta de login:", response.data);

    // Adaptamos la respuesta según la estructura que devuelve el backend
    let userData: any = null;
    let accessToken: string = "";
    let refreshToken: string = "";

    // Verificamos el formato de la respuesta
    if (response.data) {
      if (response.data.data) {
        // Si la respuesta viene con la estructura que esperamos
        userData = response.data.data.user;
        accessToken = response.data.data.access_token;
        refreshToken = response.data.data.refresh_token;
      } else {
        // Si viene en otro formato (directamente en la raíz)
        userData = response.data.user;
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
      }

      if (accessToken) {
        Cookies.set("token", accessToken);
      }

      if (refreshToken) {
        Cookies.set("refreshToken", refreshToken);
      }

      if (userData) {
        Cookies.set("user", JSON.stringify(userData));
      }
    }
    return response.data;
  } catch (error: any) {
    console.error("Error completo de login:", error);
    console.error("Respuesta de error:", error.response?.data);
    throw error;
  }
};

export const logout = (): void => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  Cookies.remove("user");
  Cookies.remove("boothId");
};

export const selectBooth = async (
  request: SelectBoothRequest
): Promise<SelectBoothResponse> => {
  try {
    console.log("Seleccionando caseta:", request);
    // Primero probamos con el endpoint que sugiere el controlador
    const response = await api.post<any>(`/users/booth/select`, {
      boothId: request.boothId,
    });

    console.log("Respuesta selección de caseta:", response.data);

    let accessToken = "";

    // Comprobamos diferentes estructuras posibles
    if (response.data) {
      if (response.data.data && response.data.data.access_token) {
        accessToken = response.data.data.access_token;
      } else if (response.data.access_token) {
        accessToken = response.data.access_token;
      }

      if (accessToken) {
        Cookies.set("token", accessToken);
      }

      Cookies.set("boothId", request.boothId.toString());
    }

    return response.data;
  } catch (error: any) {
    console.error("Error al seleccionar caseta:", error);
    console.error("Detalle del error:", error.response?.data);
    throw error;
  }
};

export const getUserBooths = async (userId: number): Promise<Booth[]> => {
  try {
    console.log(`Obteniendo casetas para el usuario ${userId}`);
    // Primero intentamos con el endpoint 'me/booths'
    try {
      const response = await api.get<ApiResponse<Booth[]>>(`/users/me/booths`);
      console.log("Casetas obtenidas (me):", response.data);
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }
    } catch (e) {
      console.log("Fallback al endpoint por ID");
    }

    // Si falla, probamos con el endpoint por ID específico
    const response = await api.get<ApiResponse<Booth[]>>(
      `/users/${userId}/booths`
    );
    console.log("Casetas obtenidas (por ID):", response.data);

    if (response.data && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error: any) {
    console.error(`Error al obtener casetas del usuario ${userId}:`, error);
    console.error("Detalle del error:", error.response?.data);
    // En caso de error, devolvemos un array vacío para evitar errores en la UI
    return [];
  }
};

// Funciones de consumo
export const getConsumptionsByUserAndBooth = async (
  userId: number,
  boothId: number
): Promise<Consumption[]> => {
  try {
    console.log(
      `Obteniendo consumos para usuario ${userId} y caseta ${boothId}`
    );
    const response = await api.get<ApiResponse<Consumption[]>>(
      `/consumption/user/${userId}/booth/${boothId}`
    );
    console.log("Respuesta de consumos:", response.data);

    if (response.data && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }

    // Si no hay datos o la estructura es diferente, devolvemos un array vacío
    return [];
  } catch (error: any) {
    console.error(`Error al obtener consumos:`, error);
    console.error("Detalle del error:", error.response?.data);

    // Para desarrollo, devolvemos datos de prueba
    if (process.env.NODE_ENV === "development") {
      console.log("Devolviendo datos de prueba para consumos");
      return [
        {
          id: 1,
          user: { id: userId } as User,
          product: {
            id: 1,
            name: "Cerveza",
            price: 1.5,
            type: "drink" as any,
            booth: { id: boothId } as Booth,
          },
          booth: { id: boothId } as Booth,
          festiveType: "sj" as any,
          year: new Date().getFullYear(),
          quantity: 5,
          date: new Date(),
        },
        {
          id: 2,
          user: { id: userId } as User,
          product: {
            id: 2,
            name: "Rebujito",
            price: 2.0,
            type: "drink" as any,
            booth: { id: boothId } as Booth,
          },
          booth: { id: boothId } as Booth,
          festiveType: "sj" as any,
          year: new Date().getFullYear(),
          quantity: 3,
          date: new Date(),
        },
      ];
    }

    return [];
  }
};

export const createConsumption = async (
  consumptionData: CreateConsumptionRequest
): Promise<Consumption> => {
  try {
    const response = await api.post<ApiResponse<Consumption>>(
      "/consumption",
      consumptionData
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Funciones de penalizaciones
export const getPenaltiesByUserAndBooth = async (
  userId: number,
  boothId: number
): Promise<Penalty[]> => {
  try {
    console.log(`Obteniendo multas para usuario ${userId} y caseta ${boothId}`);
    const response = await api.get<ApiResponse<Penalty[]>>(
      `/penalty/user/${userId}/booth/${boothId}`
    );
    console.log("Respuesta de multas:", response.data);

    if (response.data && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error: any) {
    console.error(`Error al obtener multas:`, error);
    console.error("Detalle del error:", error.response?.data);

    // Para desarrollo, devolvemos datos de prueba
    if (process.env.NODE_ENV === "development") {
      console.log("Devolviendo datos de prueba para multas");
      return [
        {
          id: 1,
          user: { id: userId } as User,
          booth: { id: boothId } as Booth,
          festiveType: "sj" as any,
          year: new Date().getFullYear(),
          amount: 10.0,
          reason: "Retraso en cuota",
          date: new Date(),
        },
        {
          id: 2,
          user: { id: userId } as User,
          booth: { id: boothId } as Booth,
          festiveType: "sj" as any,
          year: new Date().getFullYear(),
          amount: 5.0,
          reason: "No asistencia a reunión",
          date: new Date(),
        },
      ];
    }

    return [];
  }
};

export const createPenalty = async (
  penaltyData: CreatePenaltyRequest
): Promise<Penalty> => {
  try {
    const response = await api.post<ApiResponse<Penalty>>(
      "/penalty",
      penaltyData
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Funciones de gastos comunes
export const getCommonExpensesByBoothAndYear = async (
  boothId: number,
  year: number
): Promise<CommonExpense[]> => {
  try {
    console.log(
      `Obteniendo gastos comunes para caseta ${boothId} y año ${year}`
    );
    const response = await api.get<ApiResponse<CommonExpense[]>>(
      `/expenses/common-expense/${boothId}/${year}`
    );
    console.log("Respuesta de gastos comunes:", response.data);

    if (response.data && response.data.data) {
      return response.data.data;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error: any) {
    console.error("Error al obtener gastos comunes:", error);
    return [];
  }
};

/**
 * Obtener todos los gastos comunes de una caseta (sin filtrar por año)
 * Como no existe un endpoint específico, hacemos peticiones para los últimos años y consolidamos
 */
export const getCommonExpensesByBooth = async (
  boothId: number
): Promise<CommonExpense[]> => {
  try {
    console.log(`Obteniendo todos los gastos comunes para caseta ${boothId}`);

    const currentYear = new Date().getFullYear();
    const years = [
      currentYear,
      currentYear - 1,
      currentYear - 2,
      currentYear - 3,
      currentYear - 4,
    ];

    // Hacemos peticiones para cada año y luego combinamos los resultados
    const requests = years.map((year) =>
      getCommonExpensesByBoothAndYear(boothId, year)
    );
    const allResponses = await Promise.all(requests);

    // Consolidamos todos los resultados en un solo array
    const allExpenses = allResponses.flat();

    console.log(`Obtenidos ${allExpenses.length} gastos comunes en total`);
    return allExpenses;
  } catch (error) {
    console.error("Error al obtener todos los gastos comunes:", error);
    return [];
  }
};

export const createCommonExpense = async (
  expenseData: CreateCommonExpenseRequest
): Promise<CommonExpense> => {
  try {
    const response = await api.post<ApiResponse<CommonExpense>>(
      "/expenses/common-expense",
      expenseData
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Función para obtener los productos de una caseta
export const getBoothProducts = async (boothId: number) => {
  try {
    const response = await api.get<ApiResponse<any[]>>(
      `/product/booth/${boothId}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener el número de miembros de una caseta
 * Utiliza el endpoint /users/booth/{boothId} para obtener la lista de usuarios
 * y contar cuántos hay
 */
export const getBoothMembersCount = async (
  boothId: number
): Promise<number> => {
  try {
    console.log(`Obteniendo miembros para la caseta ${boothId}`);
    const response = await api.get<ApiResponse<User[]>>(
      `/users/booth/${boothId}`
    );

    // Verificamos la estructura de la respuesta
    let users: User[] = [];
    if (response.data && response.data.data) {
      users = response.data.data;
    } else if (Array.isArray(response.data)) {
      users = response.data;
    }

    console.log(
      `Se encontraron ${users.length} usuarios en la caseta ${boothId}`
    );
    return users.length || 2; // Si el array está vacío, usamos 2 como valor por defecto
  } catch (error) {
    console.error("Error al obtener el número de miembros:", error);
    return 2; // Valor predeterminado en caso de error
  }
};

export default api;
