import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { CreateMateriaDto } from './dto/create-materia.dto';

@Injectable()
export class MateriaService {
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepo: Repository<Materia>,
  ) {}

  async create(dto: CreateMateriaDto): Promise<Materia> {
    const existe = await this.materiaRepo.findOne({ where: { codigo: dto.codigo } });
    if (existe) {
      throw new BadRequestException('Ya existe una materia con ese código');
    }

    const materia = this.materiaRepo.create(dto);
    return this.materiaRepo.save(materia);
  }

  async findAll(): Promise<Materia[]> {
    return this.materiaRepo.find();
  }
}
