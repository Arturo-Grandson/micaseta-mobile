import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User, Booth } from "@/types";
import {
  login as apiLogin,
  logout as apiLogout,
  selectBooth as apiSelectBooth,
  getUserBooths,
} from "@/services/api";

interface AuthContextType {
  user: User | null;
  booths: Booth[];
  selectedBoothId: number | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectBooth: (boothId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [selectedBoothId, setSelectedBoothId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar si el usuario está autenticado al cargar la página
  useEffect(() => {
    const checkAuth = async () => {
      const userCookie = Cookies.get("user");
      const boothIdCookie = Cookies.get("boothId");

      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie) as User;
          setUser(userData);

          if (boothIdCookie) {
            setSelectedBoothId(parseInt(boothIdCookie, 10));
          }

          if (userData.id) {
            const userBooths = await getUserBooths(userData.id);
            setBooths(userBooths);
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
          Cookies.remove("user");
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Iniciando sesión con:", email);
      // Ahora se incluirá automáticamente el boothId=1 en la petición desde api.ts
      const response = await apiLogin({ email, password });

      // Obtenemos los datos del usuario de las cookies (donde apiLogin los guardó)
      const userCookie = Cookies.get("user");
      if (!userCookie) {
        throw new Error(
          "No se pudo obtener la información del usuario después del login"
        );
      }

      const userData = JSON.parse(userCookie) as User;
      console.log("Login exitoso, datos del usuario:", userData);
      setUser(userData);

      // Como estamos forzando el boothId=1 en el login, vamos a establecerlo directamente
      setSelectedBoothId(1);
      Cookies.set("boothId", "1");

      // Redirigimos directamente al dashboard sin hacer la selección de caseta
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error completo:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setUser(null);
    setSelectedBoothId(null);
    setBooths([]);
    router.push("/auth/login");
  };

  const selectBooth = async (boothId: number) => {
    setIsLoading(true);
    try {
      if (!user?.id) throw new Error("User ID is required");

      const response = await apiSelectBooth({ userId: user.id, boothId });

      if (response.success) {
        setSelectedBoothId(boothId);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Select booth error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    booths,
    selectedBoothId,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    selectBooth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
