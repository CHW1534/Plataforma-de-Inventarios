const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando seed de datos...');

  // Limpiar datos previos
  await prisma.movimiento.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.almacen.deleteMany();

  // Crear Almacenes
  const almacenCentral = await prisma.almacen.create({
    data: { nombre: 'Almacén Central', ubicacion: 'CDMX, Col. Centro' },
  });

  const almacenNorte = await prisma.almacen.create({
    data: { nombre: 'Almacén Norte', ubicacion: 'Monterrey, NL' },
  });

  console.log(`  ✓ 2 almacenes creados`);

  // Crear Productos
  const productosData = [
    { nombre: 'Monitor Gamer 24"', descripcion: 'Monitor 144hz 1ms IPS', precio: 3500, stock: 25, almacenId: almacenCentral.id },
    { nombre: 'Teclado Mecánico RGB', descripcion: 'Switches Cherry MX Blue', precio: 1200, stock: 40, almacenId: almacenCentral.id },
    { nombre: 'Mouse Inalámbrico Pro', descripcion: 'Sensor 25K DPI, batería 70hrs', precio: 850, stock: 60, almacenId: almacenCentral.id },
    { nombre: 'Audífonos Bluetooth Elite', descripcion: 'ANC, 30hrs batería', precio: 2200, stock: 15, almacenId: almacenNorte.id },
    { nombre: 'Webcam 4K Streaming', descripcion: 'Autofoco, micrófono integrado', precio: 1800, stock: 20, almacenId: almacenNorte.id },
    { nombre: 'Hub USB-C 7 en 1', descripcion: 'HDMI, USB 3.0, SD, Ethernet', precio: 650, stock: 35, almacenId: almacenCentral.id },
    { nombre: 'SSD NVMe 1TB', descripcion: 'Lectura 7000MB/s, PCIe 4.0', precio: 1500, stock: 30, almacenId: almacenNorte.id },
    { nombre: 'Silla Ergonómica Pro', descripcion: 'Soporte lumbar, reposabrazos 4D', precio: 8500, stock: 8, almacenId: almacenCentral.id },
  ];

  const productos = [];
  for (const data of productosData) {
    const p = await prisma.producto.create({ data });
    productos.push(p);
  }

  console.log(`  ✓ ${productos.length} productos creados`);

  // Crear Movimientos iniciales (entradas de stock)
  for (const prod of productos) {
    await prisma.movimiento.create({
      data: {
        productoId: prod.id,
        tipo: 'ENTRADA',
        cantidad: prod.stock,
      },
    });
  }

  console.log(`  ✓ ${productos.length} movimientos de entrada registrados`);
  console.log('Seed completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
