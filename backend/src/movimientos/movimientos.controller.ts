import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MovimientosService } from './movimientos.service';
import { RegistrarSalidaDto } from './dto/registrar-salida.dto';
import { RegistrarEntradaDto } from './dto/registrar-entrada.dto';

@ApiTags('Movimientos')
@Controller('movimientos')
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) { }

  @ApiOperation({ summary: 'Registrar una salida (reducción) de inventario' })
  @Post('salida')
  registrarSalida(@Body() dto: RegistrarSalidaDto) {
    return this.movimientosService.registrarSalida(dto);
  }

  @ApiOperation({ summary: 'Registrar una entrada (aumento) de inventario' })
  @Post('entrada')
  registrarEntrada(@Body() dto: RegistrarEntradaDto) {
    return this.movimientosService.registrarEntrada(dto);
  }

  @ApiOperation({ summary: 'Obtener el historial completo de movimientos de inventario' })
  @Get('historial')
  historial() {
    return this.movimientosService.historial();
  }
}
