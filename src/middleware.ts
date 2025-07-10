import { NextRequest, NextResponse } from "next/server";
import { PAGES } from "./lib/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const boothId = request.cookies.get("boothId")?.value;

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  const hasSelectedBooth = !!boothId;

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/auth/login"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Ruta de selección de caseta (requiere autenticación pero no selección de caseta)
  const isSelectBoothRoute = pathname.startsWith("/select-booth");

  // Redirigir según el estado de autenticación
  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL(PAGES.LOGIN, request.url));
  }

  if (isLoggedIn && isPublicRoute) {
    // Siempre redirigimos al dashboard si está autenticado y está en una ruta pública
    return NextResponse.redirect(new URL(PAGES.DASHBOARD, request.url));
  }

  // Ya no verificamos si ha seleccionado caseta, ya que se hace automáticamente en el login

  return NextResponse.next();
}

// Rutas donde se aplicará el middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
