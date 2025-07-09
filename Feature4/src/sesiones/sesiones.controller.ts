import { Controller, Get, Post, Body, Param, Put, Query, ParseIntPipe } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

@Controller('sesiones')
export class SesionesController {
  constructor(private readonly sesionesService: SesionesService) {}

  /**
   * GET /sesiones - Obtiene todas las sesiones
   */
  @Get()
  async findAll() {
    return this.sesionesService.findAll();
  }

  /**
   * GET /sesiones/pasadas - Obtiene sesiones pasadas
   */
  @Get('pasadas')
  async findPasadas() {
    return this.sesionesService.findPasadas();
  }

  /**
   * GET /sesiones/futuras - Obtiene sesiones futuras
   */
  @Get('futuras')
  async findFuturas() {
    return this.sesionesService.findFuturas();
  }

  /**
   * GET /sesiones/tutor/:tutorId - Obtiene sesiones de un tutor específico
   */
  @Get('tutor/:tutorId')
  async findByTutor(@Param('tutorId', ParseIntPipe) tutorId: number) {
    return this.sesionesService.findByTutor(tutorId);
  }

  /**
   * GET /sesiones/estudiante/:estudianteId - Obtiene sesiones de un estudiante específico
   */
  @Get('estudiante/:estudianteId')
  async findByEstudiante(@Param('estudianteId', ParseIntPipe) estudianteId: number) {
    return this.sesionesService.findByEstudiante(estudianteId);
  }

  /**
   * GET /sesiones/:id - Obtiene una sesión específica
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sesionesService.findOne(id);
  }

  /**
   * PUT /sesiones/:id/completar - Marca una sesión como completada
   * Query params: tutorId (required)
   */
  @Put(':id/completar')
  async marcarCompletada(
    @Param('id', ParseIntPipe) id: number,
    @Query('tutorId', ParseIntPipe) tutorId: number,
    @Body() updateSesionDto: UpdateSesionDto
  ) {
    return this.sesionesService.marcarCompletada(id, tutorId, updateSesionDto);
  }

  /**
   * POST /sesiones/calificar - Permite al estudiante calificar una sesión
   */
  @Post('calificar')
  async calificarSesion(@Body() createCalificacionDto: CreateCalificacionDto) {
    return this.sesionesService.calificarSesion(createCalificacionDto);
  }

  /**
   * GET /sesiones/calificaciones/tutor/:tutorId - Obtiene calificaciones de un tutor
   */
  @Get('calificaciones/tutor/:tutorId')
  async getCalificacionesTutor(@Param('tutorId', ParseIntPipe) tutorId: number) {
    return this.sesionesService.getCalificacionesTutor(tutorId);
  }

  /**
   * GET /sesiones/estadisticas/tutor/:tutorId - Obtiene estadísticas de un tutor
   */
  @Get('estadisticas/tutor/:tutorId')
  async getEstadisticasTutor(@Param('tutorId', ParseIntPipe) tutorId: number) {
    return this.sesionesService.getEstadisticasTutor(tutorId);
  }
}