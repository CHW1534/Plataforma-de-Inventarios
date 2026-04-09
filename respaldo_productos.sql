-- ============================================================
-- Respaldo de Base de Datos: Plataforma de Inventarios
-- Schema: Almacen + Producto + Movimiento
-- Generado desde: Prisma schema (PostgreSQL)
-- ============================================================

CREATE SCHEMA IF NOT EXISTS "public";

-- Tabla: Almacen
CREATE TABLE "Almacen" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ubicacion" TEXT,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Almacen_pkey" PRIMARY KEY ("id")
);

-- Tabla: Producto
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "almacenId" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- Tabla: Movimiento
CREATE TABLE "Movimiento" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- Foreign Keys
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_almacenId_fkey"
    FOREIGN KEY ("almacenId") REFERENCES "Almacen"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Movimiento" ADD CONSTRAINT "Movimiento_productoId_fkey"
    FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ============================================================
-- Datos iniciales (Seed)
-- ============================================================

-- Almacenes iniciales 
INSERT INTO "Almacen" ("nombre", "ubicacion") VALUES
    ('Almacén Central', 'CDMX, Col. Centro'),
    ('Almacén Norte', 'Monterrey, NL');

-- Productos  iniciales 
INSERT INTO "Producto" ("nombre", "descripcion", "precio", "stock", "almacenId") VALUES
    ('Monitor Gamer 24"', 'Monitor 144hz 1ms IPS', 3500, 25, 1),
    ('Teclado Mecánico RGB', 'Switches Cherry MX Blue', 1200, 40, 1),
    ('Mouse Inalámbrico Pro', 'Sensor 25K DPI, batería 70hrs', 850, 60, 1),
    ('Audífonos Bluetooth Elite', 'ANC, 30hrs batería', 2200, 15, 2),
    ('Webcam 4K Streaming', 'Autofoco, micrófono integrado', 1800, 20, 2),
    ('Hub USB-C 7 en 1', 'HDMI, USB 3.0, SD, Ethernet', 650, 35, 1),
    ('SSD NVMe 1TB', 'Lectura 7000MB/s, PCIe 4.0', 1500, 30, 2),
    ('Silla Ergonómica Pro', 'Soporte lumbar, reposabrazos 4D', 8500, 8, 1);

-- Movimientos iniciales (entradas de stock)
INSERT INTO "Movimiento" ("productoId", "tipo", "cantidad") VALUES
    (1, 'ENTRADA', 25),
    (2, 'ENTRADA', 40),
    (3, 'ENTRADA', 60),
    (4, 'ENTRADA', 15),
    (5, 'ENTRADA', 20),
    (6, 'ENTRADA', 35),
    (7, 'ENTRADA', 30),
    (8, 'ENTRADA', 8);
