# Arquitectura del Backend

A continuación, algunas notas clave sobre las decisiones técnicas y la estructura de la API:

- **NestJS como Framework**: Elegí NestJS por su enfoque modular nativo. Permite tener el código muy bien organizado, separando de forma clara los Controladores (rutas) de los Servicios (lógica de negocio), lo que facilita escalar el proyecto a futuro.
- **Prisma + PostgreSQL**: Implementar Prisma como ORM. tiene la ventaja de ofrecer un nivel de tipado estricto junto a TypeScript, quitándonos de muchos dolores de cabeza y errores de sintaxis al hacer las consultas a la base de datos.
- **DTOs y Validaciones**: Toda la entrada de datos está protegida con `class-validator` a través de DTOs. Esto funciona como un escudo: filtra requests malformados o inválidos y así asegurar que no llegue información errónea a la lógica o a la base de datos.
- **Soft Delete (Borrado Lógico)**: Para el endpoint de eliminación de productos, opte por no borrar los registros físicamente, sino marcarlos con una fecha en `deletedAt`. Esto es para mantener la integridad de los datos, ya que borrar un producto físicamente rompería la trazabilidad y el historial de los movimientos contables previos.
- **Transacciones **: En operaciones (como las entradas y salidas de almacén), se necesita actualizar el stock del producto y escribir en el historial de forma simultánea. Para ello se usan las transacciones de Prisma (`$transaction`), garantizando que todo se ejecute en bloque. Si algo falla a la mitad, no se guarda nada, evitando que la data quede inconsistente.
- **Swagger**: Se busco la manera de implementar Swagger para generar la documentación de la API.ya que permite ver, probar y entender cada endpoint de manera mucho más intuitiva.
