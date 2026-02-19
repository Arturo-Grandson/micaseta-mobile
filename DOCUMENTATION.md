# MiCaseta Mobile - Documentación Técnica

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura de Directorios](#estructura-de-directorios)
6. [Autenticación y Autorización](#autenticación-y-autorización)
7. [Componentes Principales](#componentes-principales)
8. [Servicios y APIs](#servicios-y-apis)
9. [Modelos de Datos](#modelos-de-datos)
10. [Rutas y Navegación](#rutas-y-navegación)
11. [Gestión de Estado](#gestión-de-estado)
12. [Características Principales](#características-principales)
13. [Guía de Desarrollo](#guía-de-desarrollo)
14. [Deployment](#deployment)

---

## Descripción General

**MiCaseta Mobile** es una aplicación web móvil-first construida con Next.js para gestionar gastos compartidos en casetas durante las fiestas de San Juan y Feria. Permite a los usuarios:

- Registrar consumiciones personales (bebidas y comida)
- Ver y gestionar penalizaciones
- Consultar gastos comunes de la caseta
- Calcular automáticamente deudas proporcionales
- Hacer seguimiento de gastos por tipo de fiesta y año

### Características Clave

- ✅ Interfaz móvil-first responsive
- ✅ Autenticación JWT con NextAuth
- ✅ Gestión de múltiples casetas por usuario
- ✅ Cálculo automático de gastos compartidos
- ✅ Agrupación por tipo de fiesta y año
- ✅ Modo desarrollo con datos de prueba

---

## Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.3.4 | Framework React con SSR y App Router |
| **React** | 19.0.0 | Biblioteca UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 3.3.2 | Framework CSS utility-first |
| **React Hook Form** | 7.59.0 | Gestión de formularios |
| **Zod** | 3.25.67 | Validación de esquemas |
| **Axios** | 1.10.0 | Cliente HTTP |

### Autenticación y Estado

| Tecnología | Propósito |
|------------|-----------|
| **NextAuth** | 4.24.11 - Autenticación OAuth/JWT |
| **js-cookie** | 3.0.5 - Persistencia de tokens |
| **React Context API** | Gestión de estado global |

### UI y Utilidades

| Tecnología | Propósito |
|------------|-----------|
| **React Icons** | 5.5.0 - Iconos (Feather) |
| **tailwind-merge** | 3.3.1 - Merge de clases Tailwind |
| **@hookform/resolvers** | 5.1.1 - Integración React Hook Form + Zod |

---

## Arquitectura del Proyecto

### Patrón de Arquitectura

El proyecto sigue una arquitectura de **componentes modulares** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────────┐
│          Next.js App Router                 │
│  (Routing, SSR, API Routes)                 │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Providers Layer                     │
│  (AuthProvider, NextAuth SessionProvider)   │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Components Layer                    │
│  (UI, Layout, Feature Components)           │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Hooks & State Layer                 │
│  (useAuth, Custom Hooks)                    │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Services Layer                      │
│  (API Client, Axios Interceptors)           │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│          Backend API (NestJS)                │
│  (REST API con JWT)                         │
└─────────────────────────────────────────────┘
```

### Principios de Diseño

1. **Mobile-First**: Diseño optimizado para móviles con adaptación a desktop
2. **Type Safety**: TypeScript estricto en toda la aplicación
3. **Component Reusability**: Componentes UI reutilizables y composables
4. **Separation of Concerns**: Lógica separada por capas
5. **Error Resilience**: Manejo robusto de errores con fallbacks

---

## Instalación y Configuración

### Requisitos Previos

- Node.js 20.x o superior
- npm, yarn, pnpm o bun
- Conexión al backend API (NestJS)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Arturo-Grandson/micaseta-mobile.git
cd micaseta-mobile

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### Scripts Disponibles

```bash
# Desarrollo (http://localhost:3000)
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm run start

# Linter
npm run lint
```

---

## Estructura de Directorios

```
/home/runner/work/micaseta-mobile/micaseta-mobile/
├── public/                    # Archivos estáticos
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── auth/
│   │   │   └── login/         # Página de login
│   │   ├── select-booth/      # Selección de caseta
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── consumptions/      # Gestión de consumiciones
│   │   ├── penalties/         # Vista de penalizaciones
│   │   ├── expenses/          # Gastos comunes
│   │   ├── layout.tsx         # Layout raíz con providers
│   │   ├── providers.tsx      # Configuración de providers
│   │   └── page.tsx           # Página raíz (redirección)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx               # Wrapper principal
│   │   │   └── MobileNavigation.tsx     # Navegación móvil/desktop
│   │   ├── ui/                # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Input.tsx
│   │   └── consumptions/
│   │       └── AddConsumptionModal.tsx  # Modal agregar consumición
│   ├── hooks/
│   │   └── useAuth.tsx        # Hook y Context de autenticación
│   ├── services/
│   │   └── api.ts             # Cliente Axios y funciones API
│   ├── types/
│   │   └── index.ts           # Definiciones TypeScript
│   ├── lib/
│   │   └── constants.ts       # Constantes y rutas
│   └── middleware.ts          # Middleware de protección de rutas
├── .gitignore
├── next.config.ts             # Configuración Next.js
├── package.json
├── postcss.config.mjs         # Config PostCSS
├── tailwind.config.mjs        # Config Tailwind
├── tsconfig.json              # Config TypeScript
└── README.md
```

---

## Autenticación y Autorización

### Flujo de Autenticación

1. **Login**: Usuario introduce email y contraseña
2. **Validación**: Backend valida credenciales y devuelve tokens JWT
3. **Almacenamiento**: Tokens guardados en cookies seguras
4. **Selección de Caseta**: Usuario selecciona caseta activa (actualmente auto-selecciona boothId=1)
5. **Acceso**: Middleware verifica token en cada request

### Implementación

#### Hook useAuth (`src/hooks/useAuth.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  booths: Booth[];
  selectedBoothId: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  selectBooth: (boothId: number) => void;
}
```

Características:
- Context API para estado global de autenticación
- Persistencia en cookies (user, token, boothId)
- Carga automática de casetas al inicializar
- Sincronización entre pestañas

#### Middleware de Protección (`src/middleware.ts`)

```typescript
export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  
  if (!token && !isAuthPage) {
    // Redirigir a login si no hay token
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  if (token && isAuthPage) {
    // Redirigir a dashboard si ya está autenticado
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

#### Interceptores Axios (`src/services/api.ts`)

```typescript
api.interceptors.request.use((config) => {
  const token = Cookies.get('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## Componentes Principales

### 1. Layout (`src/components/layout/Layout.tsx`)

**Propósito**: Wrapper principal que añade navegación a todas las páginas protegidas.

```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

Características:
- Incluye MobileNavigation
- Padding responsive
- Fondo degradado

### 2. MobileNavigation (`src/components/layout/MobileNavigation.tsx`)

**Propósito**: Sistema de navegación adaptativo móvil/desktop.

Características:
- **Desktop**: Sidebar fijo a la izquierda (240px)
- **Mobile**: Drawer desplegable + barra inferior fija
- Resaltado de ruta activa
- Card de bienvenida con nombre de usuario
- Logout funcional

Items de Navegación:
- Dashboard (Home icon)
- Consumiciones (ShoppingCart icon)
- Penalizaciones (AlertCircle icon)
- Gastos Comunes (DollarSign icon)

### 3. AddConsumptionModal (`src/components/consumptions/AddConsumptionModal.tsx`)

**Propósito**: Modal para agregar nuevas consumiciones.

Características:
- Grid de productos (2 columnas)
- Selector de cantidad con botones +/-
- Cálculo automático de total
- Validación de formulario
- Envío API con feedback

### 4. Componentes UI Reutilizables

#### Button (`src/components/ui/Button.tsx`)

Variantes:
- `primary`: Azul (default)
- `secondary`: Gris
- `danger`: Rojo
- `ghost`: Transparente

Tamaños:
- `sm`, `md` (default), `lg`

#### Card (`src/components/ui/Card.tsx`)

Props:
- `title?`: Título opcional
- `action?`: Botón de acción opcional
- `children`: Contenido

#### Input (`src/components/ui/Input.tsx`)

Características:
- Integración con React Hook Form
- Mensaje de error automático
- Label opcional
- Tipos: text, email, password, number

---

## Servicios y APIs

### Cliente Axios (`src/services/api.ts`)

#### Configuración Base

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
```

#### Funciones API Disponibles

##### Autenticación

```typescript
// Login
login(email: string, password: string): Promise<LoginResponse>
// Endpoint: POST /auth/login
```

##### Usuarios

```typescript
// Obtener casetas del usuario
getUserBooths(userId: number): Promise<UserBooth[]>
// Endpoint: GET /users/{userId}/booths

// Seleccionar caseta activa
selectBooth(userId: number, boothId: number): Promise<void>
// Endpoint: POST /users/booth/select
```

##### Consumiciones

```typescript
// Obtener consumiciones del usuario
getConsumptions(userId: number, boothId: number): Promise<Consumption[]>
// Endpoint: GET /consumption/user/{userId}/booth/{boothId}

// Crear nueva consumición
createConsumption(data: CreateConsumptionDto): Promise<Consumption>
// Endpoint: POST /consumption
```

##### Productos

```typescript
// Obtener productos de la caseta
getProducts(boothId: number): Promise<Product[]>
// Endpoint: GET /product/booth/{boothId}
```

##### Penalizaciones

```typescript
// Obtener penalizaciones del usuario
getPenalties(userId: number, boothId: number): Promise<Penalty[]>
// Endpoint: GET /penalty/user/{userId}/booth/{boothId}
```

##### Gastos Comunes

```typescript
// Obtener gastos comunes por año
getCommonExpensesByYear(boothId: number, year: number): Promise<CommonExpense[]>
// Endpoint: GET /expenses/common-expense/{boothId}/{year}
```

#### Manejo de Errores

```typescript
try {
  const data = await apiFunction();
  // Maneja múltiples formatos de respuesta
  return data.data || data;
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Token inválido - redirigir a login
    } else if (error.response?.status === 429) {
      // Rate limit
    }
  }
  // Fallback a datos de prueba en desarrollo
  return mockData;
}
```

---

## Modelos de Datos

### Enumeraciones (`src/types/index.ts`)

```typescript
// Tipo de fiesta
enum FestiveType {
  SJ = 'SJ',  // San Juan
  F = 'F'      // Feria
}

// Tipo de producto
enum ProductType {
  DRINK = 'DRINK',  // Bebidas
  FOOD = 'FOOD'     // Comida
}

// Rol en la caseta
enum BoothRoleType {
  ADMIN = 'ADMIN',
  USER = 'USER'
}
```

### Entidades Principales

#### User

```typescript
interface User {
  id: number;
  uuid: string;
  name: string;
  lastname: string;
  email: string;
  phone?: string;
  boothMembers?: BoothMember[];
}
```

#### Booth

```typescript
interface Booth {
  id: number;
  uuid: string;
  name: string;
}
```

#### Product

```typescript
interface Product {
  id: number;
  name: string;
  type: ProductType;
  price: number;
  booth: Booth;
}
```

#### Consumption

```typescript
interface Consumption {
  id: number;
  user: User;
  product: Product;
  booth: Booth;
  festiveType: FestiveType;
  year: number;
  quantity: number;
  date: string;  // ISO 8601
}
```

#### Penalty

```typescript
interface Penalty {
  id: number;
  user: User;
  booth: Booth;
  festiveType: FestiveType;
  year: number;
  amount: number;
  reason?: string;
  date: string;  // ISO 8601
}
```

#### CommonExpense

```typescript
interface CommonExpense {
  id: number;
  booth: Booth;
  festiveType: FestiveType;
  year: number;
  description: string;
  totalAmount: number;
  date: string;  // ISO 8601
}
```

### Relaciones

```
User 1──N BoothMember N──1 Booth
User 1──N Consumption N──1 Product
User 1──N Penalty
Booth 1──N Product
Booth 1──N CommonExpense
```

---

## Rutas y Navegación

### Mapa de Rutas

```typescript
// Rutas Públicas
/auth/login              // Login page

// Rutas Protegidas (requieren autenticación)
/                        // Redirección basada en estado
/select-booth            // Seleccionar caseta activa
/dashboard               // Dashboard principal
/consumptions            // Gestión de consumiciones
/penalties               // Vista de penalizaciones
/expenses                // Gastos comunes
```

### Lógica de Redirección (Página Raíz)

```typescript
// src/app/page.tsx
if (!isAuthenticated) {
  router.push('/auth/login');
} else if (!selectedBoothId) {
  router.push('/select-booth');
} else {
  router.push('/dashboard');
}
```

### Constantes de Rutas (`src/lib/constants.ts`)

```typescript
export const ROUTES = {
  LOGIN: '/auth/login',
  SELECT_BOOTH: '/select-booth',
  DASHBOARD: '/dashboard',
  CONSUMPTIONS: '/consumptions',
  PENALTIES: '/penalties',
  EXPENSES: '/expenses',
};
```

---

## Gestión de Estado

### AuthContext

**Ubicación**: `src/hooks/useAuth.tsx`

**Estado Global**:

```typescript
{
  user: User | null,           // Usuario actual
  booths: Booth[],             // Casetas disponibles
  selectedBoothId: number | null,  // Caseta activa
  isAuthenticated: boolean,    // Estado de autenticación
  isLoading: boolean,          // Estado de carga inicial
}
```

**Persistencia**:
- `user`: Cookie serializada
- `authToken`: Cookie HTTP-only simulada
- `selectedBoothId`: Cookie

**Sincronización**:
- Storage events para sincronizar entre pestañas
- Recarga de booths al cambiar usuario

### Estado Local de Componentes

Los componentes utilizan hooks de React para estado local:
- `useState`: Estado simple
- `useEffect`: Efectos secundarios y carga de datos
- React Hook Form: Estado de formularios

---

## Características Principales

### 1. Dashboard (`/dashboard`)

**Funcionalidad**:
- Resumen financiero del usuario en la caseta activa
- Muestra consumiciones, penalizaciones y gastos comunes
- Calcula deuda total

**Cálculos**:

```typescript
// Total de consumiciones
totalConsumptions = Σ(product.price × quantity)

// Total de penalizaciones
totalPenalties = Σ(penalty.amount)

// Gastos comunes prorrateados
userCommonExpenses = Σ(commonExpense.totalAmount / memberCount)

// Deuda total
totalDebt = totalConsumptions + totalPenalties + userCommonExpenses
```

**Visualización**:
- Cards con totales
- Barras de progreso visuales
- Agrupación por tipo de fiesta

### 2. Consumiciones (`/consumptions`)

**Funcionalidad**:
- Lista de consumiciones del usuario
- Filtrado por tipo de fiesta y año
- Adición de nuevas consumiciones mediante modal

**Agrupación**:

```typescript
const grouped = consumptions.reduce((acc, consumption) => {
  const key = `${consumption.festiveType}-${consumption.year}`;
  if (!acc[key]) acc[key] = [];
  acc[key].push(consumption);
  return acc;
}, {});
```

**Modal de Creación**:
- Selector de productos (grid 2 columnas)
- Control de cantidad (+/-)
- Cálculo en tiempo real
- Validación de formulario

### 3. Penalizaciones (`/penalties`)

**Funcionalidad**:
- Lista de penalizaciones asignadas
- Agrupación por fiesta y año
- Muestra motivo y fecha

**Visualización**:
- Cards agrupados por periodo
- Formato de fecha legible
- Total por periodo

### 4. Gastos Comunes (`/expenses`)

**Funcionalidad**:
- Lista de gastos compartidos de la caseta
- Cálculo de cuota individual (total / miembros)
- Consolidación de múltiples años

**Cálculo de Cuota**:

```typescript
const userShare = commonExpense.totalAmount / memberCount;
```

### 5. Selección de Caseta

**Funcionalidad**:
- Muestra casetas disponibles del usuario
- Permite cambiar caseta activa
- Actualiza contexto global

**Nota**: Actualmente auto-selecciona boothId=1 al hacer login.

---

## Guía de Desarrollo

### Agregar una Nueva Página

1. **Crear página en App Router**:

```typescript
// src/app/nueva-pagina/page.tsx
'use client';

import Layout from '@/components/layout/Layout';

export default function NuevaPagina() {
  return (
    <Layout>
      <h1>Nueva Página</h1>
    </Layout>
  );
}
```

2. **Agregar ruta en constants**:

```typescript
// src/lib/constants.ts
export const ROUTES = {
  // ...
  NUEVA_PAGINA: '/nueva-pagina',
};
```

3. **Agregar a navegación**:

```typescript
// src/components/layout/MobileNavigation.tsx
const navItems = [
  // ...
  { href: ROUTES.NUEVA_PAGINA, label: 'Nueva', icon: Icon },
];
```

### Crear un Nuevo Componente UI

```typescript
// src/components/ui/NuevoComponente.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface NuevoComponenteProps {
  className?: string;
  // ... otras props
}

export const NuevoComponente: React.FC<NuevoComponenteProps> = ({
  className,
  // ... otras props
}) => {
  return (
    <div className={cn('base-classes', className)}>
      {/* contenido */}
    </div>
  );
};
```

### Agregar Nueva Función API

```typescript
// src/services/api.ts

export const nuevaFuncionAPI = async (params: any): Promise<ResponseType> => {
  try {
    const response = await api.get<ApiResponse<ResponseType>>('/endpoint', {
      params,
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error en nuevaFuncionAPI:', error);
    throw error;
  }
};
```

### Definir Nuevos Tipos

```typescript
// src/types/index.ts

export interface NuevoTipo {
  id: number;
  campo1: string;
  campo2: number;
  // ...
}
```

### Mejores Prácticas

1. **TypeScript**:
   - Siempre tipar props de componentes
   - Usar interfaces para objetos complejos
   - Evitar `any`, usar `unknown` si es necesario

2. **Componentes**:
   - Usar `'use client'` solo cuando sea necesario
   - Mantener componentes pequeños y focalizados
   - Extraer lógica compleja a hooks personalizados

3. **Estilos**:
   - Preferir Tailwind sobre CSS custom
   - Usar `cn()` para combinar clases condicionales
   - Mantener consistencia con diseño mobile-first

4. **API Calls**:
   - Siempre manejar errores
   - Mostrar loading states
   - Implementar fallbacks en desarrollo

5. **Estado**:
   - Usar Context solo para estado global
   - useState para estado local de componente
   - React Hook Form para formularios

---

## Deployment

### Build de Producción

```bash
# Generar build optimizado
npm run build

# El output estará en .next/
```

### Variables de Entorno de Producción

```env
NEXT_PUBLIC_API_URL=https://api.micaseta.com
NEXTAUTH_URL=https://micaseta.com
NEXTAUTH_SECRET=<secure-random-string>
```

### Deployment en Vercel (Recomendado)

1. Conectar repositorio GitHub a Vercel
2. Configurar variables de entorno
3. Deploy automático en cada push a main

```bash
# O usar Vercel CLI
vercel --prod
```

### Deployment Manual

```bash
# Construir aplicación
npm run build

# Iniciar servidor
npm run start
```

La aplicación estará disponible en `http://localhost:3000`

### Consideraciones de Producción

- ✅ Configurar HTTPS en backend API
- ✅ Usar variables de entorno seguras
- ✅ Habilitar rate limiting en API
- ✅ Configurar CORS correctamente
- ✅ Implementar logging y monitoring
- ✅ Configurar error tracking (Sentry)
- ✅ Optimizar imágenes con Next.js Image

---

## Troubleshooting

### Problemas Comunes

#### 1. Error de Autenticación

**Síntoma**: Redirección continua a `/auth/login`

**Solución**:
- Verificar que el token esté en cookies
- Comprobar que `NEXT_PUBLIC_API_URL` sea correcto
- Revisar respuesta del endpoint `/auth/login`

#### 2. Datos No Cargan

**Síntoma**: Páginas vacías o sin datos

**Solución**:
- Abrir DevTools > Network para ver requests
- Verificar que el token Bearer se envía
- Comprobar estructura de respuesta API
- En desarrollo, verificar que caiga en mock data

#### 3. Error de CORS

**Síntoma**: Requests bloqueados por política CORS

**Solución**:
```typescript
// Backend debe tener:
app.enableCors({
  origin: ['http://localhost:3000', 'https://tu-dominio.com'],
  credentials: true,
});
```

#### 4. Estilos No Aplican

**Síntoma**: Componentes sin estilos

**Solución**:
- Verificar que Tailwind esté configurado
- Comprobar que `globals.css` se importe en layout
- Limpiar `.next/` y rebuildar: `rm -rf .next && npm run dev`

---

## Próximas Mejoras Sugeridas

### Funcionalidades

- [ ] Notificaciones push para nuevos gastos
- [ ] Historial de cambios en consumiciones
- [ ] Exportar datos a PDF/Excel
- [ ] Gráficos de gastos mensuales
- [ ] Chat de caseta
- [ ] Modo oscuro

### Técnicas

- [ ] Tests unitarios con Jest
- [ ] Tests E2E con Playwright
- [ ] Optimización de bundle size
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Storybook para componentes

---

## Recursos y Enlaces

### Documentación Oficial

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [NextAuth.js](https://next-auth.js.org)

### Repositorio

- **GitHub**: https://github.com/Arturo-Grandson/micaseta-mobile
- **Issues**: [Reportar problemas](https://github.com/Arturo-Grandson/micaseta-mobile/issues)

---

## Contacto y Soporte

Para preguntas o soporte:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**Última actualización**: Febrero 2026  
**Versión de la documentación**: 1.0.0
