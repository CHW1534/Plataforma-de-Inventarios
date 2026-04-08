# Sistema de Inventario API

Examen técnico Backend. Proyecto desarrollado con NestJS y Prisma para gestión de inventarios.

## Requisitos

- Node.js
- PostgreSQL (Base de datos llamada `inventario`, puerto 5432, user: `postgres`, pass: `postgres`)

## Instalación y Configuración

1. Entrar a la carpeta del proyecto
```bash
cd backend
```

2. Instalar dependencias
```bash
npm install
```

3. Sincronizar la base de datos (crear tablas)
```bash
npx prisma db push
```

4. Levantar el servidor en desarrollo
```bash
npm run start:dev
```

## Pruebas de la API

La API documentada se encuentra disponible en Swagger. Una vez levantado el servidor, accede a:
http://localhost:3000/docs

También se incluye un archivo `api-test.http` en la raíz con ejemplos de peticiones para probar directamente desde VS Code con la extensión REST Client.

## Base de Datos

El diseño de la base de datos y la exportación en `.sql` se encuentra en la raíz del proyecto como `respaldo_productos.sql`. Cuenta con 3 tablas: Almacen, Producto y Movimiento.

## Documentación Extra

Para detalles técnicos sobre cómo estructuré los endpoints y las decisiones de validación, dejé notas en el archivo `backend/ARQUITECTURA.md`.
