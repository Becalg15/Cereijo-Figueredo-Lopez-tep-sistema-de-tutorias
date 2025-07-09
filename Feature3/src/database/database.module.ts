import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_NAME', 'tutorias_db'),
        entities: [
          Usuario,
          Estudiante, 
          Tutor,
          Coordinador,
          Materia,
          Solicitud,
          Sesion,
          Calificacion,
          Log
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}