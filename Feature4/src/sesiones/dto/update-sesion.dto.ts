import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateSesionDto {
  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}