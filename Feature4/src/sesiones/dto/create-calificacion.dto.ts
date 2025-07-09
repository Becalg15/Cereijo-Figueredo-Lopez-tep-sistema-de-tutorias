import { IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';

export class CreateCalificacionDto {
  @IsNumber()
  sesion_id: number;

  @IsNumber()
  estudiante_id: number;

  @IsNumber()
  tutor_id: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  calificacion: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}