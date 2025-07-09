import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sesion } from '../database/entities/sesion.entity';
import { Solicitud, EstadoSolicitud } from '../database/entities/solicitud.entity';
import { CreateSesionDto } from './dto/create-sesion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

@Injectable()
export class SesionService {
  constructor(
    @InjectRepository(Sesion)
    private sesionRepository: Repository<Sesion>,
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
  ) {}

  /**
   * Crea una nueva sesión a partir de una solicitud aceptada
   */
  async create(createSesionDto: CreateSesionDto): Promise<Sesion> {
    // Verificar que la solicitud existe y está aceptada
    const solicitud = await this.solicitudRepository.findOne({
      where: { id: createSesionDto.solicitud_id },
      relations: ['estudiante', 'materia', 'tutor']
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${createSesionDto.solicitud_id} no encontrada`);
    }

    if (solicitud.estado !== EstadoSolicitud.ACEPTADA) {
      throw new BadRequestException('Solo se pueden crear sesiones a partir de solicitudes aceptadas');
    }

    // Verificar que no existe ya una sesión para esta solicitud
    const sesionExistente = await this.sesionRepository.findOne({
      where: { solicitud_id: createSesionDto.solicitud_id }
    });

    if (sesionExistente) {
      throw new BadRequestException('Ya existe una sesión para esta solicitud');
    }

    // Crear la sesión
    const sesion = this.sesionRepository.create({
      ...createSesionDto,
      tutor_id: solicitud.tutor_id,
      estudiante_id: solicitud.estudiante_id,
      materia_id: solicitud.materia_id,
      completada: false
    });

    const sesionGuardada = await this.sesionRepository.save(sesion);

    // Actualizar el estado de la solicitud
    await this.solicitudRepository.update(solicitud.id, {
      estado: EstadoSolicitud.COMPLETADA
    });

    return this.findOne(sesionGuardada.id);
  }

  /**
   * Acepta una solicitud y crea automáticamente la sesión
   */
  async aceptarSolicitud(solicitudId: number): Promise<Sesion> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id: solicitudId },
      relations: ['estudiante', 'materia', 'tutor']
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${solicitudId} no encontrada`);
    }

    if (solicitud.estado !== EstadoSolicitud.ASIGNADA) {
      throw new BadRequestException('Solo se pueden aceptar solicitudes en estado ASIGNADA');
    }

    // Actualizar estado de la solicitud a ACEPTADA
    await this.solicitudRepository.update(solicitudId, {
      estado: EstadoSolicitud.ACEPTADA
    });

    // Crear sesión automáticamente con la fecha y hora solicitadas
    const createSesionDto: CreateSesionDto = {
      solicitud_id: solicitudId,
      fecha: solicitud.fecha_solicitada.toISOString().split('T')[0],
      hora: solicitud.hora_solicitada
    };

    return this.create(createSesionDto);
  }

  /**
   * Rechaza una solicitud
   */
  async rechazarSolicitud(solicitudId: number): Promise<void> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id: solicitudId }
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${solicitudId} no encontrada`);
    }

    if (solicitud.estado !== EstadoSolicitud.ASIGNADA) {
      throw new BadRequestException('Solo se pueden rechazar solicitudes en estado ASIGNADA');
    }

    await this.solicitudRepository.update(solicitudId, {
      estado: EstadoSolicitud.RECHAZADA
    });
  }

  /**
   * Obtiene todas las sesiones
   */
  async findAll(): Promise<Sesion[]> {
    return this.sesionRepository.find({
      relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
      order: { fecha: 'DESC' }
    });
  }

  /**
   * Obtiene una sesión específica
   */
  async findOne(id: number): Promise<Sesion> {
    const sesion = await this.sesionRepository.findOne({
      where: { id },
      relations: ['solicitud', 'tutor', 'estudiante', 'materia']
    });

    if (!sesion) {
      throw new NotFoundException(`Sesión con ID ${id} no encontrada`);
    }

    return sesion;
  }

  /**
   * Obtiene todas las sesiones de un tutor
   */
  async findByTutor(tutorId: number): Promise<Sesion[]> {
    return this.sesionRepository.find({
      where: { tutor_id: tutorId },
      relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
      order: { fecha: 'DESC' }
    });
  }

  /**
   * Obtiene todas las sesiones de un estudiante
   */
  async findByEstudiante(estudianteId: number): Promise<Sesion[]> {
    return this.sesionRepository.find({
      where: { estudiante_id: estudianteId },
      relations: ['solicitud', 'tutor', 'estudiante', 'materia'],
      order: { fecha: 'DESC' }
    });
  }

  /**
   * Actualiza una sesión
   */
  async update(id: number, updateSesionDto: UpdateSesionDto): Promise<Sesion> {
    const sesion = await this.findOne(id);

    await this.sesionRepository.update(id, updateSesionDto);
    return this.findOne(id);
  }

  /**
   * Marca una sesión como completada
   */
  async marcarCompletada(id: number): Promise<Sesion> {
    return this.update(id, { completada: true });
  }

  /**
   * Elimina una sesión
   */
  async remove(id: number): Promise<void> {
    const sesion = await this.findOne(id);
    await this.sesionRepository.delete(id);
  }
}