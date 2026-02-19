# MiCaseta Mobile 🎉

> Aplicación móvil-first para la gestión de gastos compartidos en casetas durante las fiestas de San Juan y Feria.

[![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.2-38bdf8)](https://tailwindcss.com/)

---

## 📖 Descripción

**MiCaseta Mobile** es una aplicación web progresiva que permite a los miembros de una caseta:

- 📊 **Consultar** su balance financiero en tiempo real
- 🍺 **Registrar** consumiciones de bebidas y comida
- ⚠️ **Ver** penalizaciones asignadas
- 💰 **Consultar** gastos comunes prorrateados
- 📱 **Acceder** desde cualquier dispositivo móvil o desktop

---

## ✨ Características Principales

### Para Usuarios

- **Dashboard Financiero**: Resumen completo de consumiciones, penalizaciones y gastos comunes
- **Registro de Consumiciones**: Interfaz intuitiva para añadir bebidas y comida consumidas
- **Visualización de Gastos**: Desglose detallado por tipo de fiesta (San Juan/Feria) y año
- **Cálculo Automático**: Total a pagar calculado automáticamente
- **Responsive Design**: Optimizado para móviles con soporte desktop

### Técnicas

- **Autenticación JWT**: Login seguro con tokens Bearer
- **Context API**: Gestión de estado global con React
- **TypeScript**: Tipado estático para mayor seguridad
- **Tailwind CSS**: Estilos utility-first con diseño moderno
- **React Hook Form + Zod**: Formularios validados con esquemas
- **Axios Interceptors**: Gestión centralizada de requests HTTP

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 20.x o superior
- npm, yarn, pnpm o bun
- Acceso al backend API de MiCaseta

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Arturo-Grandson/micaseta-mobile.git
cd micaseta-mobile

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores
```

### Variables de Entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secreto-aqui
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build de Producción

```bash
# Construir aplicación optimizada
npm run build

# Iniciar servidor de producción
npm run start
```

### Linting

```bash
# Ejecutar linter
npm run lint
```

---

## 📚 Documentación

La documentación completa del proyecto está disponible en:

- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Documentación técnica completa
  - Arquitectura del proyecto
  - Stack tecnológico
  - Estructura de directorios
  - Componentes y APIs
  - Guía de desarrollo
  
- **[USER_GUIDE.md](./USER_GUIDE.md)** - Guía de usuario
  - Cómo usar la aplicación
  - Funcionalidades paso a paso
  - Preguntas frecuentes
  - Consejos y mejores prácticas

---

## 🏗️ Estructura del Proyecto

```
micaseta-mobile/
├── public/                    # Archivos estáticos
├── src/
│   ├── app/                   # Páginas Next.js (App Router)
│   │   ├── auth/login/        # Login
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── consumptions/      # Consumiciones
│   │   ├── penalties/         # Penalizaciones
│   │   ├── expenses/          # Gastos comunes
│   │   └── select-booth/      # Selección de caseta
│   ├── components/            # Componentes React
│   │   ├── layout/            # Componentes de layout
│   │   ├── ui/                # Componentes UI reutilizables
│   │   └── consumptions/      # Componentes específicos
│   ├── hooks/                 # Custom hooks (useAuth)
│   ├── services/              # API client (Axios)
│   ├── types/                 # TypeScript types
│   ├── lib/                   # Utilidades y constantes
│   └── middleware.ts          # Next.js middleware
├── DOCUMENTATION.md           # Documentación técnica
├── USER_GUIDE.md             # Guía de usuario
└── README.md                 # Este archivo
```

---

## 🛠️ Stack Tecnológico

### Frontend Core
- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Tipado estático

### Estilos
- **Tailwind CSS 3** - Framework CSS utility-first
- **PostCSS** - Procesador CSS

### Formularios y Validación
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **@hookform/resolvers** - Integración

### HTTP y Estado
- **Axios** - Cliente HTTP
- **NextAuth** - Autenticación
- **js-cookie** - Gestión de cookies
- **React Context API** - Estado global

### UI y UX
- **React Icons** - Iconos (Feather)
- **tailwind-merge** - Utilidades Tailwind

---

## 📱 Funcionalidades

### Autenticación
- Login con email y contraseña
- JWT tokens con refresh automático
- Gestión de sesión con cookies
- Middleware de protección de rutas

### Dashboard
- Resumen financiero completo
- Total de consumiciones
- Total de penalizaciones
- Gastos comunes prorrateados
- Visualización con barras de progreso

### Consumiciones
- Listado de consumiciones personales
- Agregar nuevas consumiciones
- Selector de productos con grid
- Cálculo automático de totales
- Agrupación por fiesta y año

### Penalizaciones
- Vista de penalizaciones asignadas
- Motivo y fecha de cada penalización
- Agrupación por periodo

### Gastos Comunes
- Listado de gastos compartidos
- Cálculo automático de cuota individual
- División proporcional entre miembros
- Desglose por descripción

---

## 🔐 Seguridad

- ✅ Autenticación JWT con Bearer tokens
- ✅ Tokens almacenados en cookies HTTP-only
- ✅ Middleware de protección de rutas
- ✅ Validación de formularios con Zod
- ✅ TypeScript para type safety
- ✅ Variables de entorno para secretos

---

## 🚢 Deployment

### Vercel (Recomendado)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Arturo-Grandson/micaseta-mobile)

1. Conecta tu repositorio GitHub a Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push a main

### Manual

```bash
npm run build
npm run start
```

La aplicación estará disponible en el puerto 3000.

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado y propietario.

---

## 📧 Contacto

- **GitHub**: [Arturo-Grandson/micaseta-mobile](https://github.com/Arturo-Grandson/micaseta-mobile)
- **Issues**: [Reportar problema](https://github.com/Arturo-Grandson/micaseta-mobile/issues)

---

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) - Framework React
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Vercel](https://vercel.com/) - Hosting y deployment

---

**Hecho con ❤️ para gestionar gastos de caseta**
