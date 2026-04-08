import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 'Monitor Gamer 24 pulgadas', description: 'Nombre completo del producto' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'Monitor 144hz 1ms', description: 'Características del producto' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ example: 3500, description: 'Precio unitario del producto' })
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiProperty({ example: 1, description: 'ID del almacén donde será guardado inicialmente' })
  @IsNumber()
  almacenId: number;

  @ApiPropertyOptional({ example: 10, description: 'Stock inicial al crear el producto' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
