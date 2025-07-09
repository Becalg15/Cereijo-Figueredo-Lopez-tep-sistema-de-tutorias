import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud, EstadoSolicitud } from '../database/entities/solicitud.entity';
import { Estudiante } from '../database/entities/estudiante.entity';
import { Materia } from '../database/entities/materia.entity';
import { Tutor } from '../database/entities/tutor.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
    @InjectRepository(Estudiante)
    private estudianteRepository: Repository<Estudiante>,
    @InjectRepository(Materia)
    private materiaRepository: Repository<Materia>,
    @InjectRepository(Tutor)
    private tutorRepository: Repository<Tutor>,
  ) {}

  /**
   * Crea una nueva solicitud de tutoría
   * Valida que el estudiante y la materia existan
   */
  async create(createSolicitudDto: CreateSolicitudDto): Promise<Solicitud> {
    // Verificar que el estudiante existe
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: createSolicitudDto.estudiante_id }
    });
    
    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${createSolicitudDto.estudiante_id} no encontrado`);
    }

    // Verificar que la materia existe
    const materia = await this.materiaRepository.findOne({
      where: { id: createSolicitudDto.materia_id }
    });
    
    if (!materia) {
      throw new NotFoundException(`Materia con ID ${createSolicitudDto.materia_id} no encontrada`);
    }

    // Crear la solicitud
    const solicitud = this.solicitudRepository.create({
      ...createSolicitudDto,
      estado: EstadoSolicitud.PENDIENTE
    });

    const solicitudGuardada = await this.solicitudRepository.save(solicitud);

    // Buscar y asignar un tutor disponible para la materia
    await this.asignarTutorDisponible(solicitudGuardada.id, createSolicitudDto.materia_id);

    return this.findOne(solicitudGuardada.id);
  }

  /**
   * Busca un tutor disponible para una materia y asigna la solicitud
   */
  private async asignarTutorDisponible(solicitudId: number, materiaId: number): Promise<void> {
    const tutor = await this.tutorRepository.findOne({
      where: { materia_id: materiaId }
    });

    if (tutor) {
      await this.solicitudRepository.update(solicitudId, {
        tutor_id: tutor.id,
        estado: EstadoSolicitud.ASIGNADA
      });
    }
  }

  /**
   * Obtiene todas las solicitudes con sus relaciones
   */
  async findAll(): Promise<Solicitud[]> {
    return this.solicitudRepository.find({
      relations: ['estudiante', 'materia', 'tutor'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  /**
   * Obtiene una solicitud específica por ID
   */
  async findOne(id: number): Promise<Solicitud> {
    const solicitud = await this.solicitudRepository.findOne({
      where: { id },
      relations: ['estudiante', 'materia', 'tutor']
    });

    if (!solicitud) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada`);
    }

    return solicitud;
  }

  /**
   * Obtiene todas las solicitudes asignadas a un tutor específico
   */
  async findByTutor(tutorId: number): Promise<Solicitud[]> {
    const tutor = await this.tutorRepository.findOne({
      where: { id: tutorId }
    });

    if (!tutor) {
      throw new NotFoundException(`Tutor con ID ${tutorId} no encontrado`);
    }

    return this.solicitudRepository.find({
      where: { tutor_id: tutorId },
      relations: ['estudiante', 'materia', 'tutor'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  /**
   * Obtiene todas las solicitudes de un estudiante específico
   */
  async findByEstudiante(estudianteId: number): Promise<Solicitud[]> {
    const estudiante = await this.estudianteRepository.findOne({
      where: { id: estudianteId }
    });

    if (!estudiante) {
      throw new NotFoundException(`Estudiante con ID ${estudianteId} no encontrado`);
    }

    return this.solicitudRepository.find({
      where: { estudiante_id: estudianteId },
      relations: ['estudiante', 'materia', 'tutor'],
      order: { fecha_creacion: 'DESC' }
    });
  }

  /**
   * Actualiza una solicitud (principalmente para cambiar estado)
   */
  async update(id: number, updateSolicitudDto: UpdateSolicitudDto): Promise<Solicitud> {
    const solicitud = await this.findOne(id);

    // Validar transiciones de estado
    this.validarTransicionEstado(solicitud.estado, updateSolicitudDto.estado);

    await this.solicitudRepository.update(id, updateSolicitudDto);
    return this.findOne(id);
  }

  /**
   * Valida que las transiciones de estado sean correctas
   */
  private validarTransicionEstado(estadoActual: EstadoSolicitud, nuevoEstado?: EstadoSolicitud): void {
    if (!nuevoEstado) return;

    const transicionesValidas : Record<EstadoSolicitud, EstadoSolicitud[]> = {
      [EstadoSolicitud.PENDIENTE]: [EstadoSolicitud.ASIGNADA],
      [EstadoSolicitud.ASIGNADA]: [EstadoSolicitud.ACEPTADA, EstadoSolicitud.RECHAZADA],
      [EstadoSolicitud.ACEPTADA]: [EstadoSolicitud.COMPLETADA],
      [EstadoSolicitud.RECHAZADA]: [],
      [EstadoSolicitud.COMPLETADA]: []
    };

    if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se puede cambiar de estado ${estadoActual} a ${nuevoEstado}`
      );
    }
  }

  /**
   * Elimina una solicitud (solo si está en estado PENDIENTE)
   */
  async remove(id: number): Promise<void> {
    const solicitud = await this.findOne(id);

    if (solicitud.estado !== EstadoSolicitud.PENDIENTE) {
      throw new BadRequestException('Solo se pueden eliminar solicitudes en estado PENDIENTE');
    }

    await this.solicitudRepository.delete(id);
  }
}