import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionesService } from './sesiones.service';
import { SesionesController } from './sesiones.controller';
import { Sesion } from '../entities/sesion.entity';
import { Calificacion } from '../entities/calificacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sesion, Calificacion])],
  controllers: [SesionesController],
  providers: [SesionesService],
  exports: [SesionesService],
})
export class SesionesModule {}