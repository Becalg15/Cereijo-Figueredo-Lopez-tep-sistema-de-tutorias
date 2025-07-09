import { IsOptional, IsBoolean, IsDateString, IsString, Matches } from 'class-validator';

export class UpdateSesionDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'hora debe estar en formato HH:MM (24 horas)'
  })
  hora?: string;

  @IsOptional()
  @IsBoolean()
  completada?: boolean;
}