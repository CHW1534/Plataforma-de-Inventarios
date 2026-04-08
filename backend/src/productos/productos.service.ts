import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProductoDto) {
    const almacen = await this.prisma.almacen.findUnique({ where: { id: data.almacenId } });
    if (!almacen) throw new BadRequestException('El almacén especificado no existe.');

    return this.prisma.producto.create({ data });
  }

  async findAll(query?: string) {
    return this.prisma.producto.findMany({
      where: { 
        deletedAt: null,
        ...(query ? { nombre: { contains: query, mode: 'insensitive' } } : {})
      },
      include: { almacen: true }
    });
  }

  async findOne(id: number) {
    const producto = await this.prisma.producto.findFirst({
      where: { id, deletedAt: null },
      include: { almacen: true }
    });
    if (!producto) throw new NotFoundException('Producto no encontrado o fue borrado');
    return producto;
  }

  async update(id: number, data: UpdateProductoDto) {
    await this.findOne(id);
    return this.prisma.producto.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    const producto = await this.findOne(id);
    
    await this.prisma.producto.update({
      where: { id },
      data: { deletedAt: new Date() }
    });

    return {
      mensaje: 'Producto eliminado (Soft Delete)',
      productoId: id,
      stockCongelado: producto.stock
    };
  }
}
