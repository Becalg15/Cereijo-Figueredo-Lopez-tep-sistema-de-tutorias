import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SesionesModule } from './sesiones/sesiones.module';
import { Usuario } from './entities/usuario.entity';
import { Estudiante } from './entities/estudiante.entity';
import { Tutor } from './entities/tutor.entity';
import { Coordinador } from './entities/coordinador.entity';
import { Materia } from './entities/materia.entity';
import { Solicitud } from './entities/solicitud.entity';
import { Sesion } from './entities/sesion.entity';
import { Calificacion } from './entities/calificacion.entity';
import { Log } from './entities/log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'tutoring_system',
      entities: [
        Usuario,
        Estudiante,
        Tutor,
        Coordinador,
        Materia,
        Solicitud,
        Sesion,
        Calificacion,
        Log,
      ],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    SesionesModule,
  ],
})
export class AppModule {}