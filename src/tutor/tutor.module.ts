import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { Tutor } from './entities/tutor.entity';
import { Usuario } from '../users/entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor, Usuario])],
  controllers: [TutorController],
  providers: [TutorService],
  exports:[TutorService],
})
export class TutorModule {}
