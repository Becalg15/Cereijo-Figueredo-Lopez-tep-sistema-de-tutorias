import {
  Controller,
  Post,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';

@Controller('materias')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() dto: CreateMateriaDto) {
    return this.materiaService.create(dto);
  }

  @Get()
  async findAll() {
    return this.materiaService.findAll();
  }
}
