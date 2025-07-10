import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coordinador } from './entities/coordinador.entity';
import { CreateCoordinadorDto } from './dto/create-coordinador.dto';
import { UpdateCoordinadorDto } from './dto/update-coordinador.dto';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../users/entities/usuario.entity';
import { SesionTutoria } from '../sesion-tutoria/entities/sesion-tutoria.entity';
import { Tutor } from '../tutor/entities/tutor.entity';
import { Materia } from '../materia/entities/materia.entity';

@Injectable()
export class CoordinadorService {
  constructor(
    @InjectRepository(Coordinador)
    private coordinadorRepo: Repository<Coordinador>,

    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,

    @InjectRepository(SesionTutoria)
    private sesionRepo: Repository<SesionTutoria>,
  ) {}

  async create(dto: CreateCoordinadorDto): Promise<Coordinador> {
    const existe = await this.usuarioRepo.findOne({ where: { correo: dto.correo } });
    if (existe) {
      throw new BadRequestException('El correo ya está registrado');
    }

    const hash = await bcrypt.hash(dto.contraseña, 10);

    const usuario = this.usuarioRepo.create({
      nombre: dto.nombre,
      correo: dto.correo,
      contraseña: hash,
    });
    const savedUser = await this.usuarioRepo.save(usuario);

    const coordinador = this.coordinadorRepo.create({
      id: savedUser.id,
      cedula: dto.cedula,
      departamento: dto.departamento,
      extension_interna: dto.extension_interna,
    });

    return this.coordinadorRepo.save(coordinador);
  }

  async obtenerPerfil(usuarioId: number): Promise<Coordinador> {
    const coordinador = await this.coordinadorRepo.findOne({
      where: { id: usuarioId },
      relations: ['usuario'],
    });

    if (!coordinador) {
      throw new NotFoundException('Coordinador no encontrado');
    }

    const { contraseña, ...usuarioSinClave } = coordinador.usuario as any;
    return {
      ...coordinador,
      usuario: usuarioSinClave,
    };
  }

  async actualizarPerfil(
    usuarioId: number,
    dto: UpdateCoordinadorDto,
  ): Promise<Coordinador> {
    const coordinador = await this.coordinadorRepo.findOneBy({ id: usuarioId });
    if (!coordinador) {
      throw new NotFoundException('Coordinador no encontrado');
    }

    this.coordinadorRepo.merge(coordinador, dto);
    return this.coordinadorRepo.save(coordinador);
  }

  async sesionesPorTutor() {
  const data = await this.sesionRepo
    .createQueryBuilder('sesion')
    .select('tutor.id', 'tutorId')
    .addSelect('usuario.nombre', 'tutorNombre')
    .addSelect('COUNT(*)', 'totalSesiones')
    .innerJoin('sesion.tutor', 'tutor')
    .innerJoin('tutor.usuario', 'usuario')
    .groupBy('tutor.id')
    .addGroupBy('usuario.nombre')
    .getRawMany();

  return data;
}

async sesionesPorMateria() {
  const data = await this.sesionRepo
    .createQueryBuilder('sesion')
    .select('materia.id', 'materiaId')
    .addSelect('materia.nombre', 'materiaNombre')
    .addSelect('COUNT(*)', 'totalSesiones')
    .innerJoin('sesion.materia', 'materia')
    .groupBy('materia.id')
    .addGroupBy('materia.nombre')
    .getRawMany();

  return data;
}

}
