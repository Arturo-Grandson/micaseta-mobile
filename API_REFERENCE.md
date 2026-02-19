# MiCaseta Mobile - Referencia Rápida API

## 🔗 Endpoints Disponibles

### Base URL
```
http://localhost:3001  (desarrollo)
https://api.micaseta.com  (producción)
```

---

## 🔐 Autenticación

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña"
}
```

**Respuesta exitosa (200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Juan",
    "lastname": "Pérez",
    "email": "usuario@example.com",
    "phone": "+34123456789"
  }
}
```

---

## 👤 Usuarios

### Obtener Casetas del Usuario
```http
GET /users/{userId}/booths
Authorization: Bearer {access_token}
```

**Respuesta exitosa (200)**:
```json
[
  {
    "booth": {
      "id": 1,
      "uuid": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Caseta Los Alegres"
    },
    "role": "USER"
  }
]
```

### Seleccionar Caseta Activa
```http
POST /users/booth/select
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "userId": 1,
  "boothId": 1
}
```

**Respuesta exitosa (200)**:
```json
{
  "message": "Booth selected successfully"
}
```

---

## 🛒 Consumiciones

### Obtener Consumiciones del Usuario
```http
GET /consumption/user/{userId}/booth/{boothId}
Authorization: Bearer {access_token}
```

**Respuesta exitosa (200)**:
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "name": "Juan",
      "lastname": "Pérez"
    },
    "product": {
      "id": 5,
      "name": "Cerveza",
      "type": "DRINK",
      "price": 2.5
    },
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    },
    "festiveType": "SJ",
    "year": 2024,
    "quantity": 3,
    "date": "2024-06-23T18:30:00.000Z"
  }
]
```

### Crear Nueva Consumición
```http
POST /consumption
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "userId": 1,
  "boothId": 1,
  "productId": 5,
  "quantity": 2,
  "festiveType": "SJ",
  "year": 2024
}
```

**Respuesta exitosa (201)**:
```json
{
  "id": 25,
  "user": { "id": 1 },
  "product": { "id": 5 },
  "booth": { "id": 1 },
  "festiveType": "SJ",
  "year": 2024,
  "quantity": 2,
  "date": "2024-06-23T19:15:00.000Z"
}
```

---

## 📦 Productos

### Obtener Productos de la Caseta
```http
GET /product/booth/{boothId}
Authorization: Bearer {access_token}
```

**Respuesta exitosa (200)**:
```json
[
  {
    "id": 1,
    "name": "Cerveza",
    "type": "DRINK",
    "price": 2.5,
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    }
  },
  {
    "id": 2,
    "name": "Refresco",
    "type": "DRINK",
    "price": 1.5,
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    }
  },
  {
    "id": 3,
    "name": "Bocadillo",
    "type": "FOOD",
    "price": 4.0,
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    }
  }
]
```

---

## ⚠️ Penalizaciones

### Obtener Penalizaciones del Usuario
```http
GET /penalty/user/{userId}/booth/{boothId}
Authorization: Bearer {access_token}
```

**Respuesta exitosa (200)**:
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "name": "Juan",
      "lastname": "Pérez"
    },
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    },
    "festiveType": "SJ",
    "year": 2024,
    "amount": 10.0,
    "reason": "Llegada tarde a la limpieza",
    "date": "2024-06-24T10:00:00.000Z"
  }
]
```

---

## 💰 Gastos Comunes

### Obtener Gastos Comunes por Año
```http
GET /expenses/common-expense/{boothId}/{year}
Authorization: Bearer {access_token}
```

**Parámetros**:
- `boothId`: ID de la caseta
- `year`: Año de los gastos (ej: 2024)

**Respuesta exitosa (200)**:
```json
[
  {
    "id": 1,
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    },
    "festiveType": "SJ",
    "year": 2024,
    "description": "Alquiler de caseta",
    "totalAmount": 600.0,
    "date": "2024-06-20T00:00:00.000Z"
  },
  {
    "id": 2,
    "booth": {
      "id": 1,
      "name": "Caseta Los Alegres"
    },
    "festiveType": "SJ",
    "year": 2024,
    "description": "Decoración",
    "totalAmount": 200.0,
    "date": "2024-06-21T00:00:00.000Z"
  }
]
```

---

## 📝 Tipos de Datos

### FestiveType (Enum)
```typescript
enum FestiveType {
  SJ = 'SJ',  // San Juan
  F = 'F'      // Feria
}
```

### ProductType (Enum)
```typescript
enum ProductType {
  DRINK = 'DRINK',  // Bebida
  FOOD = 'FOOD'     // Comida
}
```

### BoothRoleType (Enum)
```typescript
enum BoothRoleType {
  ADMIN = 'ADMIN',  // Administrador
  USER = 'USER'     // Usuario
}
```

---

## 🔒 Autenticación en Requests

Todos los endpoints (excepto `/auth/login`) requieren token JWT en el header:

```http
Authorization: Bearer {access_token}
```

**Ejemplo con cURL**:
```bash
curl -X GET "http://localhost:3001/consumption/user/1/booth/1" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -H "Content-Type: application/json"
```

**Ejemplo con Axios (JavaScript)**:
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Añadir token en cada request
api.interceptors.request.use((config) => {
  const token = getTokenFromStorage();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ❌ Códigos de Error Comunes

| Código | Significado | Solución |
|--------|-------------|----------|
| 400 | Bad Request | Verificar formato de datos enviados |
| 401 | Unauthorized | Token inválido o expirado - relogin |
| 403 | Forbidden | Sin permisos para esta acción |
| 404 | Not Found | Recurso no existe |
| 429 | Too Many Requests | Rate limit - esperar y reintentar |
| 500 | Internal Server Error | Error del servidor - contactar admin |

**Ejemplo de respuesta de error**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Token has expired"
}
```

---

## 📊 Estructura de Respuestas

### Respuesta con Wrapper
```json
{
  "data": [...],
  "message": "Success"
}
```

### Respuesta Directa
```json
[...]
```

**Nota**: El cliente debe manejar ambos formatos:
```javascript
const data = response.data.data || response.data;
```

---

## 🔄 Rate Limiting

- **Límite**: 100 requests por minuto por IP
- **Header de respuesta**: `X-RateLimit-Remaining`
- **Al exceder**: HTTP 429 - Esperar 60 segundos

---

## 🧪 Datos de Prueba (Desarrollo)

### Usuario de Prueba
```json
{
  "email": "test@micaseta.com",
  "password": "test123"
}
```

### Caseta de Prueba
- ID: 1
- Nombre: "Caseta Los Alegres"
- Miembros: 20

### Productos de Prueba
1. Cerveza - €2.50 (DRINK)
2. Refresco - €1.50 (DRINK)
3. Bocadillo - €4.00 (FOOD)
4. Tapas - €3.50 (FOOD)

---

## 🛠️ Herramientas Útiles

### Postman Collection
Importar colección de Postman para probar todos los endpoints:
```
[Incluir enlace a postman_collection.json]
```

### Swagger/OpenAPI
Documentación interactiva de API:
```
http://localhost:3001/api/docs
```

---

## 📞 Soporte

Para problemas con la API:
- Revisar logs del servidor
- Verificar formato de datos
- Consultar esta referencia
- Contactar al equipo backend

---

**Última actualización**: Febrero 2026  
**Versión API**: 1.0.0
