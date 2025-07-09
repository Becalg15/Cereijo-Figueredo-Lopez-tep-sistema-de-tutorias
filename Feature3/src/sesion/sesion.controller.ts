import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put } from '@nestjs/common';
import { SesionService } from './sesion.service';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

@Controller('sesiones')
export class SesionController {
  constructor(private readonly sesionService: SesionService) {}

  /**
   * POST /sesiones
   * Crea una nueva sesión
   */
  @Post()
  create(@Body() createSesionDto: CreateSesionDto) {
    return this.sesionService.create(createSesionDto);
  }

  /**
   * POST /sesiones/aceptar/:solicitudId
   * Acepta una solicitud y crea automáticamente la sesión
   */
  @Post('aceptar/:solicitudId')
  aceptarSolicitud(@Param('solicitudId', ParseIntPipe) solicitudId: number) {
    return this.sesionService.aceptarSolicitud(solicitudId);
  }

  /**
   * POST /sesiones/rechazar/:solicitudId
   * Rechaza una solicitud
   */
  @Post('rechazar/:solicitudId')
  rechazarSolicitud(@Param('solicitudId', ParseIntPipe) solicitudId: number) {
    return this.sesionService.rechazarSolicitud(solicitudId);
  }

  /**
   * GET /sesiones
   * Obtiene todas las sesiones
   */
  @Get()
  findAll() {
    return this.sesionService.findAll();
  }

  /**
   * GET /sesiones/tutor/:tutorId
   * Obtiene todas las sesiones de un tutor
   */
  @Get('tutor/:tutorId')
  findByTutor(@Param('tutorId', ParseIntPipe) tutorId: number) {
    return this.sesionService.findByTutor(tutorId);
  }

  /**
   * GET /sesiones/estudiante/:estudianteId
   * Obtiene todas las sesiones de un estudiante
   */
  @Get('estudiante/:estudianteId')
  findByEstudiante(@Param('estudianteId', ParseIntPipe) estudianteId: number) {
    return this.sesionService.findByEstudiante(estudianteId);
  }

  /**
   * GET /sesiones/:id
   * Obtiene una sesión específica
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sesionService.findOne(id);
  }

  /**
   * PATCH /sesiones/:id
   * Actualiza una sesión
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSesionDto: UpdateSesionDto
  ) {
    return this.sesionService.update(id, updateSesionDto);
  }

  /**
   * PUT /sesiones/:id/completar
   * Marca una sesión como completada
   */
  @Put(':id/completar')
  marcarCompletada(@Param('id', ParseIntPipe) id: number) {
    return this.sesionService.marcarCompletada(id);
  }

  /**
   * DELETE /sesiones/:id
   * Elimina una sesión
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.sesionService.remove(id);
  }
}