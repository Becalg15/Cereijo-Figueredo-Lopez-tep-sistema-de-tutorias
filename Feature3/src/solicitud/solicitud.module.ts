import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudService } from './solicitud.service';
import { SolicitudController } from './solicitud.controller';
import { Solicitud } from '../database/entities/solicitud.entity';
import { Estudiante } from '../database/entities/estudiante.entity';
import { Materia } from '../database/entities/materia.entity';
import { Tutor } from '../database/entities/tutor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Solicitud,
      Estudiante,
      Materia,
      Tutor
    ])
  ],
  controllers: [SolicitudController],
  providers: [SolicitudService],
  exports: [SolicitudService]
})
export class SolicitudModule {}