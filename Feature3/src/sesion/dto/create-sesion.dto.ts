import { IsNotEmpty, IsNumber, IsDateString, IsString, Matches } from 'class-validator';

export class CreateSesionDto {
  @IsNotEmpty()
  @IsNumber()
  solicitud_id: number | undefined;

  @IsNotEmpty()
  @IsDateString()
  fecha: string | undefined;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'hora debe estar en formato HH:MM (24 horas)'
  })
  hora: string | undefined;
}