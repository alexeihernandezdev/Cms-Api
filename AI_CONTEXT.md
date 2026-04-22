# AI_CONTEXT - CMS API (NestJS + MongoDB)

## 1. Stack Tecnológico

- **Framework:** NestJS (con TypeScript)
- **Base de Datos:** MongoDB (usando Mongoose)
- **Autenticación:** Passport.js + JWT
- **Validación:** Class-validator + Class-transformer
- **Documentación:** Swagger (@nestjs/swagger)

## 2. Estructura del Proyecto (Modular)

Cada recurso debe vivir en su propio módulo:
/src
  /auth               # Login, Estrategia JWT
  /users              # Gestión de usuarios y perfiles
  /content            # CRUD de contenidos (Posts/Artículos)
  /common             # Guards (Roles), Interceptors, Decoradores
  /settings           # crud para configuraciones
  /messages           # crud para mensajes, (Formulario de contactos)
  app.module.ts       # Módulo raíz
  main.ts             # Punto de entrada (Configuración global)

## 3. Roles y Permisos

- **ADMIN:** Acceso total (crear, editar, eliminar cualquier contenido y gestionar usuarios).
- **USER:** Solo puede leer contenido y editar su propio perfil.

## 4. Definición de Modelos (Mongoose)

- **User:**
  - email (String, unique, required)
  - password (String, select: false)
  - roles (String[], default: ['USER'])
  - profile (Object: firstName, lastName)
  - sections (String[])
- **Content:**
  - title (String)
  - body (String)
  - type (Enum: 'Post', 'SERVICES')
  - author (ObjectId -> User)
  - ownerEmail (String, índice; copia del email del JWT al crear, para consultas y regla multiusuario)
  - status (Enum: 'DRAFT', 'PUBLISHED')
  - createdAt / updatedAt (Timestamps)
  - keywords: (String[])
  - links: (String[])
  - refs: (String[])
- **Settings:**
  - key: (String)
  - value: (String)
- **Messages:**
  - name: (String)
  - email: (String)
  - message: (String)
  - phone: (String)
  - businessName: (String)

## 5. Reglas de Desarrollo

- Usar **DTOs** (Data Transfer Objects) para cada entrada de datos.
- Proteger rutas usando `@UseGuards(JwtAuthGuard, RolesGuard)`.
- Usar el decorador personalizado `@Roles(Role.ADMIN)` para autorizar.
- Respuestas de error claras usando `HttpException` de NestJS.
- La api será multiusuario por lo que hay que validar que los USER solo pueden ver sus datos creados y los ADMIN si pueden ver todo los datos
- Tambien se debe vincular todos los datos a un correo

### Convenciones implementadas (API)

- Prefijo global de rutas: **`/api`**. Documentación Swagger: **`/api/docs`**. Autenticación: **Bearer JWT** (`Authorization: Bearer <token>`).
- **Sin registro público.** El primer administrador se crea al arrancar si la BD no tiene usuarios y existen `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD` en el entorno. Altas posteriores: **`POST /api/users`** con JWT de rol **ADMIN** (`CreateUserDto`: email, password, opcional roles, sections, nombre).
- **Contenido:** al crear, `author` y `ownerEmail` se toman del usuario del JWT (no del body). Listados y CRUD aplican filtro por autor/correo para USER; ADMIN sin filtro de alcance.
- **Settings:** lectura pública por clave en `GET /api/settings/public/:key`; gestión (lista, upsert, delete) solo **ADMIN**.
- **Messages:** envío público `POST /api/messages`; listado y borrado solo **ADMIN**.

## 6. Mapa de Funcionalidades (Backlog)

### **Hito 1: Infraestructura**

- [x] 1.1 Setup inicial de NestJS y conexión a MongoDB.
- [x] 1.2 Configuración de variables de entorno (.env).
- [x] 1.3 Implementación de Swagger en `main.ts`.

### **Hito 2: Auth & Seguridad**

- [x] 2.1 Módulo de Usuarios y Hash de contraseñas.
- [x] 2.2 Login con JWT; alta de usuarios por ADMIN o semilla inicial (`SEED_ADMIN_*`).
- [x] 2.3 `JwtAuthGuard` para protección de rutas.
- [x] 2.4 `RolesGuard` y Decorador `@Roles()`.

### **Hito 3: CMS Engine**

- [x] 3.1 CRUD básico de Contenido.
- [x] 3.2 Lógica para asignar `author` automáticamente desde el JWT.
- [x] 3.3 Paginación y filtros de búsqueda en contenido.

### **Extensión (módulos §2)**

- [x] CRUD / lectura de **Settings** y flujo de **Messages** (contacto) según modelos y reglas de acceso.
