import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { SolicitudService } from './solicitud.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Controller('solicitudes')
export class SolicitudController {
  constructor(private readonly solicitudService: SolicitudService) {}

  /**
   * POST /solicitudes
   * Crea una nueva solicitud de tutoría
   */
  @Post()
  create(@Body() createSolicitudDto: CreateSolicitudDto) {
    return this.solicitudService.create(createSolicitudDto);
  }

  /**
   * GET /solicitudes
   * Obtiene todas las solicitudes
   */
  @Get()
  findAll() {
    return this.solicitudService.findAll();
  }

  /**
   * GET /solicitudes/tutor/:tutorId
   * Obtiene todas las solicitudes asignadas a un tutor
   */
  @Get('tutor/:tutorId')
  findByTutor(@Param('tutorId', ParseIntPipe) tutorId: number) {
    return this.solicitudService.findByTutor(tutorId);
  }

  /**
   * GET /solicitudes/estudiante/:estudianteId
   * Obtiene todas las solicitudes de un estudiante
   */
  @Get('estudiante/:estudianteId')
  findByEstudiante(@Param('estudianteId', ParseIntPipe) estudianteId: number) {
    return this.solicitudService.findByEstudiante(estudianteId);
  }

  /**
   * GET /solicitudes/:id
   * Obtiene una solicitud específica
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.findOne(id);
  }

  /**
   * PATCH /solicitudes/:id
   * Actualiza una solicitud (cambiar estado, asignar tutor)
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSolicitudDto: UpdateSolicitudDto
  ) {
    return this.solicitudService.update(id, updateSolicitudDto);
  }

  /**
   * DELETE /solicitudes/:id
   * Elimina una solicitud
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudService.remove(id);
  }
}