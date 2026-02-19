# Guía de Contribución - MiCaseta Mobile

¡Gracias por tu interés en contribuir a MiCaseta Mobile! Este documento proporciona directrices para contribuir al proyecto.

---

## 📋 Tabla de Contenidos

1. [Código de Conducta](#código-de-conducta)
2. [¿Cómo Puedo Contribuir?](#cómo-puedo-contribuir)
3. [Configuración del Entorno](#configuración-del-entorno)
4. [Proceso de Desarrollo](#proceso-de-desarrollo)
5. [Estándares de Código](#estándares-de-código)
6. [Proceso de Pull Request](#proceso-de-pull-request)
7. [Reportar Bugs](#reportar-bugs)
8. [Sugerir Mejoras](#sugerir-mejoras)

---

## Código de Conducta

Este proyecto se adhiere a un código de conducta. Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables.

### Nuestros Estándares

✅ **Comportamientos Aceptados**:
- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista
- Aceptar críticas constructivas
- Enfocarse en lo mejor para la comunidad
- Mostrar empatía hacia otros miembros

❌ **Comportamientos Inaceptables**:
- Uso de lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes o ataques personales
- Acoso público o privado
- Publicar información privada de otros
- Conducta que razonablemente se considere inapropiada

---

## ¿Cómo Puedo Contribuir?

### Tipos de Contribución

1. **Reportar Bugs** 🐛
   - Encuentra y reporta errores
   - Proporciona información detallada para reproducir

2. **Sugerir Funcionalidades** 💡
   - Propón nuevas características
   - Mejoras de UX/UI
   - Optimizaciones de rendimiento

3. **Mejorar Documentación** 📚
   - Corregir errores tipográficos
   - Añadir ejemplos
   - Mejorar claridad

4. **Contribuir Código** 💻
   - Fix bugs
   - Implementar features
   - Refactorizar código
   - Añadir tests

5. **Revisar Pull Requests** 👀
   - Revisar código de otros
   - Probar cambios
   - Dar feedback constructivo

---

## Configuración del Entorno

### Requisitos

- Node.js 20.x o superior
- npm 10.x o superior
- Git
- Editor de código (VSCode recomendado)

### Setup Inicial

```bash
# 1. Fork el repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU_USUARIO/micaseta-mobile.git
cd micaseta-mobile

# 3. Añadir upstream remote
git remote add upstream https://github.com/Arturo-Grandson/micaseta-mobile.git

# 4. Instalar dependencias
npm install

# 5. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# 6. Iniciar servidor de desarrollo
npm run dev
```

### Extensiones VSCode Recomendadas

Instala estas extensiones para mejor experiencia de desarrollo:

- **ESLint** - Linting de JavaScript/TypeScript
- **Prettier** - Formateo de código
- **Tailwind CSS IntelliSense** - Autocompletado de Tailwind
- **TypeScript Vue Plugin** - Soporte TypeScript
- **GitLens** - Git supercharged

---

## Proceso de Desarrollo

### 1. Crear una Rama

```bash
# Actualizar main
git checkout main
git pull upstream main

# Crear rama para tu feature/fix
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/descripcion-bug
```

**Convención de Nombres de Ramas**:
- `feature/` - Nuevas funcionalidades
- `fix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `test/` - Añadir o modificar tests
- `style/` - Cambios de estilo (CSS, formato)

### 2. Hacer Cambios

```bash
# Hacer tus cambios
# Guardar frecuentemente

# Ver cambios
git status
git diff
```

### 3. Ejecutar Tests y Linter

```bash
# Linter
npm run lint

# Fix automático de problemas de lint
npm run lint -- --fix

# Build para verificar que compila
npm run build
```

### 4. Commit

Usa commits descriptivos siguiendo [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Añadir cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: añadir filtro por fecha en consumiciones"
git commit -m "fix: corregir cálculo de gastos comunes"
git commit -m "docs: actualizar guía de usuario"
```

**Formato de Mensajes de Commit**:
```
<tipo>(<scope>): <descripción corta>

[cuerpo opcional con más detalles]

[footer opcional con referencias a issues]
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios de formato (espacios, semicolons, etc)
- `refactor`: Refactorización (ni fix ni feature)
- `test`: Añadir o modificar tests
- `chore`: Cambios en build, configuración, etc

**Ejemplos**:
```bash
git commit -m "feat(consumptions): añadir paginación en lista"
git commit -m "fix(auth): corregir redirección tras login"
git commit -m "docs(readme): actualizar instrucciones de instalación"
git commit -m "refactor(api): simplificar manejo de errores"
```

### 5. Push

```bash
# Push a tu fork
git push origin feature/nombre-descriptivo
```

---

## Estándares de Código

### TypeScript

✅ **Buenas Prácticas**:
```typescript
// Usar interfaces para objetos
interface User {
  id: number;
  name: string;
  email: string;
}

// Evitar 'any', usar tipos específicos
const getUser = async (id: number): Promise<User> => {
  // ...
}

// Tipar props de componentes
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}
```

❌ **Evitar**:
```typescript
// No usar 'any'
const data: any = await fetch();

// No obviar tipos de retorno
function calculate(a, b) {
  return a + b;
}

// No dejar props sin tipar
const Button = ({ label, onClick }) => {
  // ...
}
```

### Componentes React

✅ **Buenas Prácticas**:
```typescript
// Usar functional components con TypeScript
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  title, 
  children, 
  className 
}) => {
  return (
    <div className={cn('bg-white rounded-lg', className)}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// Extraer lógica compleja a custom hooks
const useUserData = (userId: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data
  }, [userId]);
  
  return { user, loading };
};
```

### Estilos con Tailwind

✅ **Buenas Prácticas**:
```typescript
// Usar cn() para combinar clases
import { cn } from '@/lib/utils';

<button className={cn(
  'px-4 py-2 rounded',
  'bg-blue-500 hover:bg-blue-600',
  'text-white font-medium',
  isDisabled && 'opacity-50 cursor-not-allowed'
)} />

// Extraer clases repetidas a constantes
const buttonBaseClasses = 'px-4 py-2 rounded font-medium';
const buttonVariants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
};
```

### Naming Conventions

```typescript
// Components: PascalCase
const UserProfile = () => {};

// Hooks: camelCase con prefijo 'use'
const useAuth = () => {};

// Utilities: camelCase
const formatDate = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'http://...';

// Interfaces/Types: PascalCase
interface UserData {}
type UserId = number;

// Files:
// - Components: PascalCase.tsx (Button.tsx)
// - Utilities: camelCase.ts (formatters.ts)
// - Hooks: camelCase.tsx (useAuth.tsx)
```

### Imports

```typescript
// Orden de imports:
// 1. React/Next
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Bibliotecas externas
import axios from 'axios';
import { z } from 'zod';

// 3. Imports internos (con alias @)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';

// 4. Tipos
import type { User, Booth } from '@/types';

// 5. Estilos (si aplica)
import './styles.css';
```

---

## Proceso de Pull Request

### Antes de Crear el PR

✅ **Checklist**:
- [ ] El código compila sin errores (`npm run build`)
- [ ] El linter no muestra errores (`npm run lint`)
- [ ] Has probado los cambios localmente
- [ ] Has actualizado la documentación si es necesario
- [ ] Los commits tienen mensajes descriptivos
- [ ] Has sincronizado con la rama main más reciente

### Crear el Pull Request

1. **Push tu rama**:
```bash
git push origin feature/nombre-descriptivo
```

2. **Ir a GitHub** y crear Pull Request

3. **Llenar el template**:

```markdown
## Descripción
[Describe qué hace este PR]

## Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que añade funcionalidad)
- [ ] Breaking change (fix o feature que causa que funcionalidad existente no funcione como antes)
- [ ] Documentación

## ¿Cómo se ha Probado?
[Describe cómo probaste tus cambios]

## Checklist
- [ ] Mi código sigue el style guide del proyecto
- [ ] He realizado self-review de mi código
- [ ] He comentado código complejo
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He probado que mi fix funciona
- [ ] He verificado que no rompo funcionalidad existente

## Screenshots (si aplica)
[Añade screenshots para cambios visuales]

## Issues Relacionados
Closes #[issue_number]
```

### Durante la Revisión

- Responde a los comentarios de revisión
- Realiza cambios solicitados
- Push nuevos commits a la misma rama
- Marca conversaciones como resueltas cuando aplique

### Después de la Aprobación

- El maintainer hará merge de tu PR
- Tu rama será eliminada
- Los cambios estarán en main

---

## Reportar Bugs

### Antes de Reportar

1. **Busca** si el bug ya fue reportado en [Issues](https://github.com/Arturo-Grandson/micaseta-mobile/issues)
2. **Verifica** que sea realmente un bug y no un error de configuración
3. **Recopila** información sobre el bug

### Crear Issue de Bug

Usa el template de bug report:

```markdown
## Descripción del Bug
[Descripción clara del problema]

## Pasos para Reproducir
1. Ir a '...'
2. Hacer clic en '....'
3. Scroll hasta '....'
4. Ver error

## Comportamiento Esperado
[Qué esperabas que sucediera]

## Comportamiento Actual
[Qué sucede actualmente]

## Screenshots
[Si aplica, añade screenshots]

## Entorno
- OS: [ej. macOS 12.0]
- Navegador: [ej. Chrome 95]
- Versión Node: [ej. 20.0.0]
- Versión Next.js: [ej. 15.3.4]

## Información Adicional
[Cualquier otro contexto relevante]
```

---

## Sugerir Mejoras

### Feature Request

```markdown
## Descripción de la Funcionalidad
[Descripción clara de la funcionalidad propuesta]

## ¿Por qué es Necesaria?
[Explica el problema que resuelve]

## Solución Propuesta
[Cómo debería funcionar]

## Alternativas Consideradas
[Otras formas de resolver el problema]

## Información Adicional
- Mockups/Wireframes (si aplica)
- Ejemplos de implementaciones similares
- Referencias
```

---

## Guías Específicas

### Añadir Nueva Página

1. Crear archivo en `/src/app/nueva-pagina/page.tsx`
2. Usar Layout component
3. Añadir ruta en `constants.ts`
4. Actualizar navegación en `MobileNavigation.tsx`
5. Añadir protección en `middleware.ts` si es necesario
6. Documentar en README

### Añadir Nuevo Componente UI

1. Crear en `/src/components/ui/`
2. Seguir patrón de componentes existentes
3. Tipar todas las props
4. Usar Tailwind para estilos
5. Exportar desde index si aplica
6. Documentar props y uso

### Añadir Endpoint API

1. Añadir función en `/src/services/api.ts`
2. Tipar request y response
3. Manejar errores apropiadamente
4. Añadir a documentación API
5. Probar con diferentes escenarios

---

## Recursos Útiles

### Documentación

- [DOCUMENTATION.md](./DOCUMENTATION.md) - Documentación técnica
- [USER_GUIDE.md](./USER_GUIDE.md) - Guía de usuario
- [API_REFERENCE.md](./API_REFERENCE.md) - Referencia API

### Enlaces Externos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

## Obtener Ayuda

¿Necesitas ayuda?

1. **Lee la documentación** - Revisa [DOCUMENTATION.md](./DOCUMENTATION.md)
2. **Busca en Issues** - Puede que tu pregunta ya fue respondida
3. **Crea una Discussion** - Para preguntas generales
4. **Contacta a maintainers** - Para asuntos específicos

---

## Agradecimientos

¡Gracias por contribuir a MiCaseta Mobile! Tu tiempo y esfuerzo son muy apreciados. 🙏

Cada contribución, grande o pequeña, hace que este proyecto sea mejor para todos.

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0.0
