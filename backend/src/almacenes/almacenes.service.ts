import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAlmacenDto } from './dto/create-almacen.dto';

@Injectable()
export class AlmacenesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAlmacenDto) {
    return this.prisma.almacen.create({ data });
  }

  async findAll() {
    return this.prisma.almacen.findMany({ where: { deletedAt: null } });
  }

  async valorTotal() {
    const productosActivos = await this.prisma.producto.findMany({
      where: { deletedAt: null, stock: { gt: 0 } }
    });
    
    const valor = productosActivos.reduce((acc, p) => acc + (p.precio * p.stock), 0);

    return {
      totalValor: valor,
      moneda: 'MXN', 
      productosContabilizados: productosActivos.length
    };
  }
}
