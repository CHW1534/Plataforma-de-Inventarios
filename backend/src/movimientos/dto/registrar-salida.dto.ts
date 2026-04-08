import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarSalidaDto {
  @ApiProperty({ example: 1, description: 'ID del producto del que se restará stock' })
  @IsNumber()
  productoId: number;

  @ApiProperty({ example: 2, description: 'Cantidad de unidades a retirar' })
  @IsNumber()
  @Min(1)
  cantidad: number;
}
