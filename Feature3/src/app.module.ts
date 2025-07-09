import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudModule } from './solicitud/solicitud.module';
import { SesionModule } from './sesion/sesion.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    SolicitudModule,
    SesionModule,
  ],
})
export class AppModule {}