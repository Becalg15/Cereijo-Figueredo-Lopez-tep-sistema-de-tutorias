import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionService } from './sesion.service';
import { SesionController } from './sesion.controller';
import { Sesion } from '../database/entities/sesion.entity';
import { Solicitud } from '../database/entities/solicitud.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sesion,
      Solicitud
    ])
  ],
  controllers: [SesionController],
  providers: [SesionService],
  exports: [SesionService]
})
export class SesionModule {}