# Plataforma de Inventarios

Sistema de gestión de inventario desarrollado como proyecto full-stack con **NestJS** en el backend y **React** en el frontend. Permite administrar almacenes, productos y movimientos de stock (entradas/salidas) con trazabilidad completa.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Modelo de Datos](#modelo-de-datos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Levantar el Proyecto con Docker](#levantar-el-proyecto-con-docker)
- [Levantar el Proyecto sin Docker](#levantar-el-proyecto-sin-docker)
- [Decisiones de Diseño](#decisiones-de-diseño)
- [Respaldo SQL](#respaldo-sql)

---

## Descripción General

La plataforma cubre las operaciones principales de un sistema de inventario:

- **Almacenes**: Crear y consultar ubicaciones físicas donde se almacena mercancía.
- **Productos**: CRUD completo (crear, leer, actualizar y eliminar con soft delete) de productos asignados a un almacén.
- **Movimientos**: Registro de entradas y salidas de stock con validación de cantidades. Cada movimiento actualiza el stock del producto de forma atómica usando transacciones de base de datos.
- **Dashboard**: Vista general con métricas en tiempo real (productos activos, stock total, valor del inventario, productos con stock bajo).

---

## Arquitectura del Proyecto

El repositorio está organizado como un monorepo con dos proyectos independientes:

```
Plataforma-de-Inventarios/
├── backend/          → API REST con NestJS + Prisma
├── frontend/         → SPA con React + Vite
├── docker-compose.yml
└── respaldo_productos.sql
```

### ¿Por qué esta arquitectura?

- **Separación backend/frontend**: Preferí tener cada proyecto por separado con su propio `package.json` y Dockerfile para que se puedan desarrollar y probar de forma independiente.

- **NestJS para el backend**: Lo elegí porque ya tiene una estructura organizada con módulos, controladores y servicios. Además viene con soporte para validación y Swagger para documentar la API.

- **Prisma como ORM**: Me gustó que con Prisma puedo definir las tablas en un solo archivo (`schema.prisma`) y ya me genera los tipos de TypeScript. También usé las transacciones de Prisma para que los movimientos de stock no queden a medias si algo falla.

- **React con Vite para el frontend**: React es con lo que más he trabajado y Vite me permite levantar el proyecto rápido durante el desarrollo.

- **Docker para el entorno**: Agregué Docker Compose para poder levantar la base de datos, el backend y el frontend con un solo comando y que funcione igual en cualquier máquina.

---

## Stack Tecnológico

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 20 | Runtime de JavaScript |
| NestJS | 11 | Framework backend con estructura modular |
| Prisma | 7 | ORM con tipado seguro para PostgreSQL |
| PostgreSQL | 15 | Base de datos relacional |
| class-validator | 0.15 | Validación de DTOs con decoradores |
| Swagger | 11 | Documentación interactiva de la API |

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Librería para construir la interfaz |
| TypeScript | 6 | Tipado estático sobre JavaScript |
| Vite | 8 | Bundler y servidor de desarrollo |
| Axios | 1.15 | Cliente HTTP para consumir la API |
| React Router | 7 | Navegación entre vistas (SPA) |
| Lucide React | 1.7 | Iconos SVG para la interfaz |

---

## Estructura del Repositorio

```
backend/
├── prisma/
│   ├── schema.prisma          # Definición del modelo de datos
│   └── seed.js                # Script para poblar la BD con datos iniciales
├── prisma.config.ts           # Configuración de Prisma (URL de conexión)
├── src/
│   ├── main.ts                # Punto de entrada (Swagger, validación, prefijo /api)
│   ├── app.module.ts          # Módulo raíz que registra los 3 módulos
│   ├── prisma.service.ts      # Servicio de conexión a PostgreSQL
│   ├── productos/
│   │   ├── productos.controller.ts   # Endpoints CRUD de productos
│   │   ├── productos.service.ts      # Lógica de negocio (soft delete, búsqueda)
│   │   └── dto/                      # Data Transfer Objects con validación
│   ├── almacenes/
│   │   ├── almacenes.controller.ts   # Endpoints de almacenes
│   │   ├── almacenes.service.ts      # Lógica (crear, listar, valor total)
│   │   └── dto/
│   └── movimientos/
│       ├── movimientos.controller.ts # Endpoints de entrada/salida/historial
│       ├── movimientos.service.ts    # Lógica con transacciones atómicas
│       └── dto/
├── Dockerfile
└── package.json

frontend/
├── src/
│   ├── main.tsx               # Punto de entrada de React
│   ├── App.tsx                # Layout principal con sidebar y rutas
│   ├── App.css                # Estilos (tema oscuro, componentes)
│   ├── api.ts                 # Cliente Axios + tipos + funciones de API
│   └── pages/
│       ├── DashboardPage.tsx  # Resumen general del inventario
│       ├── ProductosPage.tsx  # Tabla con CRUD (crear, editar, eliminar)
│       ├── AlmacenesPage.tsx  # Grid de almacenes + crear
│       └── MovimientosPage.tsx # Formulario entrada/salida + historial
├── Dockerfile
├── nginx.conf                 # Configuración de nginx para SPA
└── package.json
```

---

## Modelo de Datos

El esquema define tres tablas relacionadas:

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Almacen   │       │   Producto   │       │  Movimiento  │
├─────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)     │──1:N─▶│ id (PK)      │──1:N─▶│ id (PK)      │
│ nombre      │       │ nombre       │       │ productoId   │
│ ubicacion?  │       │ descripcion? │       │ tipo         │
│ deletedAt?  │       │ precio       │       │ cantidad     │
│             │       │ stock        │       │ fecha        │
│             │       │ almacenId(FK)│       │              │
│             │       │ deletedAt?   │       │              │
└─────────────┘       └──────────────┘       └──────────────┘
```

- Un **Almacén** tiene muchos **Productos**.
- Un **Producto** tiene muchos **Movimientos** (historial de entradas y salidas).
- Los productos y almacenes usan **soft delete** (`deletedAt`) para no perder datos históricos.
- Los movimientos se crean dentro de una **transacción** que también actualiza el stock del producto, garantizando consistencia.

---

## Endpoints de la API

La documentación interactiva completa está disponible en **Swagger UI** al ejecutar el proyecto en: `http://localhost:3002/docs`

### Productos (`/api/productos`)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/productos` | Crear un producto nuevo |
| `GET` | `/api/productos` | Listar todos los productos (soporta `?q=` para búsqueda) |
| `GET` | `/api/productos/:id` | Obtener un producto por su ID |
| `PATCH` | `/api/productos/:id` | Actualizar nombre, descripción o precio |
| `DELETE` | `/api/productos/:id` | Eliminar producto (soft delete) |

### Almacenes (`/api/almacenes`)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/almacenes` | Crear un almacén nuevo |
| `GET` | `/api/almacenes` | Listar todos los almacenes |
| `GET` | `/api/almacenes/valor-total` | Calcular el valor total del inventario |

### Movimientos (`/api/movimientos`)

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/movimientos/entrada` | Registrar entrada de stock (suma unidades) |
| `POST` | `/api/movimientos/salida` | Registrar salida de stock (resta unidades, valida disponibilidad) |
| `GET` | `/api/movimientos/historial` | Consultar historial completo de movimientos |

---

## Levantar el Proyecto con Docker

### Requisitos previos
- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/CHW1534/Plataforma-de-Inventarios.git
cd Plataforma-de-Inventarios
```

2. **Construir y levantar los contenedores**
```bash
docker-compose build
docker-compose up -d
```

Esto levanta tres servicios:

| Servicio | Puerto | Descripción |
|---|---|---|
| `db` | `5434` | PostgreSQL 15 |
| `backend` | `3002` | API NestJS |
| `frontend` | `5173` | React (nginx) |

3. **Esperar a que el backend inicialice** (la primera vez ejecuta migraciones y seed automáticamente):
```bash
docker logs inventario-backend --follow
```

Deberías ver:
```
Your database is now in sync with your Prisma schema.
Iniciando seed de datos...
  ✓ 2 almacenes creados
  ✓ 8 productos creados
  ✓ 8 movimientos de entrada registrados
Seed completado exitosamente.
Backend ejecutándose en: http://localhost:3001/api
```

4. **Abrir en el navegador**
- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:3002/api/productos](http://localhost:3002/api/productos)
- Swagger: [http://localhost:3002/docs](http://localhost:3002/docs)

### Detener los servicios
```bash
docker-compose down
```

Para eliminar también los datos de la base de datos:
```bash
docker-compose down -v
```

---

## Levantar el Proyecto sin Docker

### Requisitos previos
- [Node.js](https://nodejs.org/) v20 o superior
- [PostgreSQL](https://www.postgresql.org/download/) instalado y corriendo
- Una base de datos creada (ejemplo: `inventario`)

### 1. Configurar la base de datos

Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE inventario;
```

### 2. Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en la raíz de `backend/`:
```env
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/inventario?schema=public"
```

Sincronizar el esquema con la base de datos:
```bash
npx prisma db push
```

(Opcional) Poblar con datos de ejemplo:
```bash
node prisma/seed.js
```

Iniciar el servidor de desarrollo:
```bash
npm run start:dev
```

El backend estará disponible en `http://localhost:3000/api`.

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
```

Antes de iniciar, verificar que el archivo `src/api.ts` apunte al backend correcto. Si el backend corre en el puerto 3000 (sin Docker), cambiar la línea:

```typescript
// En src/api.ts, cambiar:
baseURL: 'http://localhost:3002/api',
// Por:
baseURL: 'http://localhost:3000/api',
```

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

---

## Decisiones de Diseño

### Backend

- **Un módulo por entidad**: Separé productos, almacenes y movimientos en su propio módulo, cada uno con su controller, service y DTOs. Así es más fácil encontrar el código de cada funcionalidad.

- **Soft delete**: Cuando se elimina un producto no se borra de la base de datos, solo se le pone una fecha en `deletedAt`. Así no se pierden los movimientos que ya se habían registrado para ese producto.

- **Transacciones en movimientos**: Cuando se registra una entrada o salida, uso `$transaction` de Prisma para crear el movimiento y actualizar el stock en una sola operación. Si algo falla, ninguno de los dos cambios se guarda.

- **Validación con DTOs**: Uso `class-validator` para validar lo que llega a cada endpoint antes de procesarlo. Por ejemplo, que el precio no sea negativo o que la cantidad sea al menos 1.

- **Prefijo `/api`**: Todos los endpoints están bajo `/api` para que quede claro qué rutas son de la API y qué rutas son del frontend.

### Frontend

- **CSS puro sin frameworks**: Usé CSS con variables personalizadas para el diseño oscuro. No me pareció necesario meter Tailwind para un proyecto de este tamaño.

- **Una página por vista**: Cada sección (Dashboard, Productos, Almacenes, Movimientos) es un componente que maneja su propio estado y hace sus propias llamadas a la API.

- **Modales para crear y editar**: En vez de navegar a otra página para crear o editar un producto, usé modales. Me pareció más práctico para el usuario.

- **Iconos con Lucide React**: Usé la librería Lucide para los iconos SVG del sidebar y las acciones de la tabla.

---

## Respaldo SQL

El archivo `respaldo_productos.sql` en la raíz del repositorio contiene:

- Sentencias `CREATE TABLE` para las tres tablas (Almacen, Producto, Movimiento) con sus llaves primarias y foráneas.
- Sentencias `INSERT INTO` con datos iniciales de ejemplo (2 almacenes, 8 productos, 8 movimientos).

Se puede importar directamente en PostgreSQL:
```bash
psql -U postgres -d inventario -f respaldo_productos.sql
```
