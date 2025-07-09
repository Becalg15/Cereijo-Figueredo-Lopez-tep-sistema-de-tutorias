import { IsOptional, IsEnum, IsNumber } from 'class-validator';
import { EstadoSolicitud } from '../../database/entities/solicitud.entity';

export class UpdateSolicitudDto {
  @IsOptional()
  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud;

  @IsOptional()
  @IsNumber()
  tutor_id?: number;
}