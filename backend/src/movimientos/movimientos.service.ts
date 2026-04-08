import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { RegistrarSalidaDto } from './dto/registrar-salida.dto';
import { RegistrarEntradaDto } from './dto/registrar-entrada.dto';

@Injectable()
export class MovimientosService {
  constructor(private prisma: PrismaService) { }

  async registrarSalida(data: RegistrarSalidaDto) {
    const producto = await this.prisma.producto.findUnique({ where: { id: data.productoId } });
    if (!producto || producto.deletedAt !== null) {
      throw new NotFoundException('Producto no encontrado o inactivo');
    }

    if (producto.stock < data.cantidad) {
      throw new BadRequestException(`Stock insuficiente. Stock actual en almacén: ${producto.stock}`);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.producto.update({
        where: { id: data.productoId },
        data: { stock: { decrement: data.cantidad } }
      });

      return tx.movimiento.create({
        data: {
          productoId: data.productoId,
          tipo: 'SALIDA',
          cantidad: data.cantidad
        }
      });
    });
  }

  async registrarEntrada(data: RegistrarEntradaDto) {
    const producto = await this.prisma.producto.findUnique({ where: { id: data.productoId } });
    if (!producto || producto.deletedAt !== null) {
      throw new NotFoundException('Producto no encontrado o inactivo');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.producto.update({
        where: { id: data.productoId },
        data: { stock: { increment: data.cantidad } }
      });

      return tx.movimiento.create({
        data: {
          productoId: data.productoId,
          tipo: 'ENTRADA',
          cantidad: data.cantidad
        }
      });
    });
  }

  async historial() {
        return this.prisma.movimiento.findMany({
          include: { producto: true },
          orderBy: { fecha: 'desc' }
        });
      }
    }
