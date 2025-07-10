// dto/filtro-sesiones.dto.ts
import { IsOptional, IsBooleanString, IsInt, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltroSesionesDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tutorId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  materiaId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsBooleanString()
  completada?: string; // 'true' o 'false'
}
