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
  /auth               # Login, Registro, Estrategia JWT
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

## 6. Mapa de Funcionalidades (Backlog)

### **Hito 1: Infraestructura**
- [ ] 1.1 Setup inicial de NestJS y conexión a MongoDB.
- [ ] 1.2 Configuración de variables de entorno (.env).
- [ ] 1.3 Implementación de Swagger en `main.ts`.

### **Hito 2: Auth & Seguridad**
- [ ] 2.1 Módulo de Usuarios y Hash de contraseñas.
- [ ] 2.2 Endpoint de Registro y Login con JWT.
- [ ] 2.3 `JwtAuthGuard` para protección de rutas.
- [ ] 2.4 `RolesGuard` y Decorador `@Roles()`.

### **Hito 3: CMS Engine**
- [ ] 3.1 CRUD básico de Contenido.
- [ ] 3.2 Lógica para asignar `author` automáticamente desde el JWT.
- [ ] 3.3 Validación de permisos: Un EDITOR no puede eliminar.
- [ ] 3.4 Paginación y filtros de búsqueda en contenido.