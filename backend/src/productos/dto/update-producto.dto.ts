import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductoDto {
  @ApiPropertyOptional({ example: 'Monitor Gamer 27 pulgadas', description: 'Nuevo nombre del producto' })
  @IsString()
  @IsOptional()
  nombre?: string;

  @ApiPropertyOptional({ example: 'Monitor 240hz', description: 'Nuevas características del producto' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ example: 4500, description: 'Nuevo precio unitario' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  precio?: number;
}
