import { IsNotEmpty, IsNumber, IsDateString, IsString, Matches } from 'class-validator';

export class CreateSolicitudDto {
  @IsNotEmpty()
  @IsNumber()
  estudiante_id: number | undefined;

  @IsNotEmpty()
  @IsNumber()
  materia_id!: number;

  @IsNotEmpty()
  @IsDateString()
  fecha_solicitada: string | undefined;

  @IsNotEmpty()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'hora_solicitada debe estar en formato HH:MM (24 horas)'
  })
  hora_solicitada: string | undefined;
}