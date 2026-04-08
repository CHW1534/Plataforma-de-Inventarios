import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAlmacenDto {
  @ApiProperty({ example: 'Almacén Principal', description: 'Nombre del almacén' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ example: 'CDMX', description: 'Ubicación física del almacén' })
  @IsString()
  @IsOptional()
  ubicacion?: string;
}
