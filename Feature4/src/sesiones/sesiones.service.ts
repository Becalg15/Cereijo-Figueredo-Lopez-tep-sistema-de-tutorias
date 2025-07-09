import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThanOrEqual } from 'typeorm';
import { Sesion } from '../entities/sesion.entity';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

@Injectable()
export class SesionesService {
  constructor(
    @InjectRepository(Sesion)
    private sesionRepository: Repository<Sesion>,
    @InjectRepository(Calificacion)
    private calificacionRepository: Repository<Calificacion>,
  ) {}

  /**
   * Obtiene todas las sesiones con sus relaciones
   * @returns Promise<Sesion[]>
   */
  async findAll(): Promise<Sesion[]> {
    return this.sesionRepository.find({
      relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Obtiene sesiones pasadas (anteriores a hoy)
   * @returns Promise<Sesion[]>
   */
  async findPasadas(): Promise<Sesion[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return this.sesionRepository.find({
      where: { fecha: LessThan(hoy) },
      relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
      order: { fecha: 'DESC', hora: 'DESC' },
    });
  }

  /**
   * Obtiene sesiones futuras (hoy en adelante)
   * @returns Promise<Sesion[]>
   */
  async findFuturas(): Promise<Sesion[]> {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    return this.sesionRepository.find({
      where: { fecha: MoreThanOrEqual(hoy) },
      relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Obtiene sesiones de un tutor específico
   * @param tutorId - ID del tutor
   * @returns Promise<Sesion[]>
   */
  async findByTutor(tutorId: number): Promise<Sesion[]> {
    return this.sesionRepository.find({
      where: { tutor_id: tutorId },
      relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Obtiene sesiones de un estudiante específico
   * @param estudianteId - ID del estudiante
   * @returns Promise<Sesion[]>
   */
  async findByEstudiante(estudianteId: number): Promise<Sesion[]> {
    return this.sesionRepository.find({
      where: { estudiante_id: estudianteId },
      relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
  }

  /**
   * Busca una sesión por ID
   * @param id - ID de la sesión
   * @returns Promise<Sesion>
   */
  async findOne(id: number): Promise<Sesion> {
    const sesion = await this.sesionRepository.findOne({
      where: { id },
      relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
    });

    if (!sesion) {
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }

    return sesion;
  }

  /**
   * Marca una sesión como completada (solo tutores)
   * @param id - ID de la sesión
   * @param tutorId - ID del tutor que marca la sesión
   * @param updateSesionDto - Datos de actualización
   * @returns Promise<Sesion>
   */
  async marcarCompletada(id: number, tutorId: number, updateSesionDto: UpdateSesionDto): Promise<Sesion> {
    const sesion = await this.findOne(id);

    // Verificar que el tutor sea el propietario de la sesión
    if (sesion.tutor_id !== tutorId) {
      throw new BadRequestException('Solo el tutor asignado puede marcar la sesión como completada');
    }

    // Verificar que la sesión no esté ya completada
    if (sesion.completada) {
      throw new BadRequestException('La sesión ya está marcada como completada');
    }

    // Actualizar el estado
    await this.sesionRepository.update(id, updateSesionDto);
    
    return this.findOne(id);
  }

  /**
   * Permite al estudiante calificar una sesión
   * @param createCalificacionDto - Datos de la calificación
   * @returns Promise<Calificacion>
   */
  async calificarSesion(createCalificacionDto: CreateCalificacionDto): Promise<Calificacion> {
    const sesion = await this.findOne(createCalificacionDto.sesion_id);

    // Verificar que la sesión esté completada
    if (!sesion.completada) {
      throw new BadRequestException('Solo se pueden calificar sesiones completadas');
    }

    // Verificar que el estudiante sea el propietario de la sesión
    if (sesion.estudiante_id !== createCalificacionDto.estudiante_id) {
      throw new BadRequestException('Solo el estudiante de la sesión puede calificarla');
    }

    // Verificar que no haya una calificación previa
    const calificacionExistente = await this.calificacionRepository.findOne({
      where: { 
        sesion_id: createCalificacionDto.sesion_id,
        estudiante_id: createCalificacionDto.estudiante_id
      }
    });

    if (calificacionExistente) {
      throw new BadRequestException('Ya existe una calificación para esta sesión');
    }

    // Crear la calificación
    const nuevaCalificacion = this.calificacionRepository.create(createCalificacionDto);
    return this.calificacionRepository.save(nuevaCalificacion);
  }

  /**
   * Obtiene todas las calificaciones de un tutor
   * @param tutorId - ID del tutor
   * @returns Promise<Calificacion[]>
   */
  async getCalificacionesTutor(tutorId: number): Promise<Calificacion[]> {
    return this.calificacionRepository.find({
      where: { tutor_id: tutorId },
      relations: ['sesion', 'estudiante', 'tutor'],
      order: { fecha: 'DESC' },
    });
  }

  /**
   * Obtiene estadísticas de calificaciones de un tutor
   * @param tutorId - ID del tutor
   * @returns Promise<any>
   */
  async getEstadisticasTutor(tutorId: number): Promise<any> {
    const calificaciones = await this.getCalificacionesTutor(tutorId);
    
    if (calificaciones.length === 0) {
      return {
        total_calificaciones: 0,
        promedio: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const suma = calificaciones.reduce((acc, cal) => acc + cal.calificacion, 0);
    const promedio = suma / calificaciones.length;
    
    const distribucion = calificaciones.reduce((acc, cal) => {
      acc[cal.calificacion] = (acc[cal.calificacion] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    return {
      total_calificaciones: calificaciones.length,
      promedio: Math.round(promedio * 100) / 100,
      distribucion
    };
  }
}