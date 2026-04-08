import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarEntradaDto {
  @ApiProperty({ example: 1, description: 'ID del producto al que se le sumará stock' })
  @IsNumber()
  productoId: number;

  @ApiProperty({ example: 5, description: 'Cantidad de unidades a ingresar' })
  @IsNumber()
  @Min(1)
  cantidad: number;
}
