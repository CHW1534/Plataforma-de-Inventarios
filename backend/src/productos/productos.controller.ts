import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@ApiTags('Productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @ApiOperation({ summary: 'Registrar un nuevo producto en un almacén' })
  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @ApiOperation({ summary: 'Obtener la lista de todos los productos (con opción de buscar por nombre)' })
  @ApiQuery({ name: 'q', required: false, description: 'Término de búsqueda para filtrar productos por nombre o descripción' })
  @Get()
  findAll(@Query('q') query?: string) {
    return this.productosService.findAll(query);
  }

  @ApiOperation({ summary: 'Obtener un producto específico por su ID' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  @ApiOperation({ summary: 'Actualizar la información de un producto (como su precio o nombre)' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(id, updateProductoDto);
  }

  @ApiOperation({ summary: 'Eliminar un producto (Borrado Lógico temporal)' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }
}
