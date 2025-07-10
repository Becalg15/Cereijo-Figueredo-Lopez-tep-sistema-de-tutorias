import { Module, forwardRef } from '@nestjs/common';
import { CoordinadorService } from './coordinador.service';
import { CoordinadorController } from './coordinador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coordinador } from './entities/coordinador.entity';
import { Usuario } from '../users/entities/usuario.entity';
import { SolicitudTutoriaModule } from '../solicitud-tutoria/solicitud-tutoria.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coordinador, Usuario]),
    forwardRef(() => SolicitudTutoriaModule),
  ],
  providers: [CoordinadorService],
  controllers: [CoordinadorController],
})
export class CoordinadorModule {}
