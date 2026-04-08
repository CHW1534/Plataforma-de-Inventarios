import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AlmacenesService } from './almacenes.service';
import { CreateAlmacenDto } from './dto/create-almacen.dto';

@ApiTags('Almacenes')
@Controller('almacenes')
export class AlmacenesController {
  constructor(private readonly almacenesService: AlmacenesService) {}

  @ApiOperation({ summary: 'Crear un nuevo almacén' })
  @Post()
  create(@Body() createAlmacenDto: CreateAlmacenDto) {
    return this.almacenesService.create(createAlmacenDto);
  }

  @ApiOperation({ summary: 'Obtener la lista de todos los almacenes' })
  @Get()
  findAll() {
    return this.almacenesService.findAll();
  }

  @ApiOperation({ summary: 'Consultar el valor total del inventario en todos los almacenes' })
  @Get('valor-total')
  valorTotal() {
    return this.almacenesService.valorTotal();
  }
}
