import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SesionesService } from './sesiones.service';
import { Sesion } from '../entities/sesion.entity';
import { Calificacion } from '../entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';
import { beforeEach, describe } from 'node:test';
// Import Jest globals for mocking

describe('SesionesService', () => {
  let service: SesionesService;
  let sesionRepository: Repository<Sesion>;
  let calificacionRepository: Repository<Calificacion>;

  // Mock data
  const mockSesion: Partial<Sesion> = {
    id: 1,
    solicitud_id: 1,
    tutor_id: 1,
    estudiante_id: 1,
    materia_id: 1,
    fecha: new Date('2024-01-15'),
    hora: '10:00',
    completada: false,
    tutor: {
      id: 1,
      cedula: '12345678',
      profesion: 'Ingeniero',
      experiencia: 'Experiencia en matemáticas',
      telefono: '123456789',
      materia_id: 1,
    } as any,
    estudiante: {
      id: 1,
      cedula: '87654321',
      carrera: 'Ingeniería',
      semestre: 5,
      telefono: '987654321',
    } as any,
    materia: {
      id: 1,
      nombre: 'Matemáticas',
      codigo: 'MAT101',
    } as any,
    calificaciones: [],
  };

  const mockCalificacion: Partial<Calificacion> = {
    id: 1,
    sesion_id: 1,
    estudiante_id: 1,
    tutor_id: 1,
    calificacion: 5,
    comentario: 'Excelente sesión',
    fecha: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SesionesService,
        {
          provide: getRepositoryToken(Sesion),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Calificacion),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SesionesService>(SesionesService);
    sesionRepository = module.get<Repository<Sesion>>(getRepositoryToken(Sesion));
    calificacionRepository = module.get<Repository<Calificacion>>(getRepositoryToken(Calificacion));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of sessions', async () => {
      const mockSesiones = [mockSesion];
      jest.spyOn(sesionRepository, 'find').mockResolvedValue(mockSesiones as Sesion[]);

      const result = await service.findAll();

      expect(result).toEqual(mockSesiones);
      expect(sesionRepository.find).toHaveBeenCalledWith({
        relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    });
  });

  describe('findPasadas', () => {
    it('should return past sessions', async () => {
      const mockSesiones = [mockSesion];
      jest.spyOn(sesionRepository, 'find').mockResolvedValue(mockSesiones as Sesion[]);

      const result = await service.findPasadas();

      expect(result).toEqual(mockSesiones);
      expect(sesionRepository.find).toHaveBeenCalledWith({
        where: { fecha: expect.any(Object) },
        relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
        order: { fecha: 'DESC', hora: 'DESC' },
      });
    });
  });

  describe('findFuturas', () => {
    it('should return future sessions', async () => {
      const mockSesiones = [mockSesion];
      jest.spyOn(sesionRepository, 'find').mockResolvedValue(mockSesiones as Sesion[]);

      const result = await service.findFuturas();

      expect(result).toEqual(mockSesiones);
      expect(sesionRepository.find).toHaveBeenCalledWith({
        where: { fecha: expect.any(Object) },
        relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    });
  });

  describe('findByTutor', () => {
    it('should return sessions for a specific tutor', async () => {
      const tutorId = 1;
      const mockSesiones = [mockSesion];
      jest.spyOn(sesionRepository, 'find').mockResolvedValue(mockSesiones as Sesion[]);

      const result = await service.findByTutor(tutorId);

      expect(result).toEqual(mockSesiones);
      expect(sesionRepository.find).toHaveBeenCalledWith({
        where: { tutor_id: tutorId },
        relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    });
  });

  describe('findByEstudiante', () => {
    it('should return sessions for a specific student', async () => {
      const estudianteId = 1;
      const mockSesiones = [mockSesion];
      jest.spyOn(sesionRepository, 'find').mockResolvedValue(mockSesiones as Sesion[]);

      const result = await service.findByEstudiante(estudianteId);

      expect(result).toEqual(mockSesiones);
      expect(sesionRepository.find).toHaveBeenCalledWith({
        where: { estudiante_id: estudianteId },
        relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
        order: { fecha: 'ASC', hora: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a session by id', async () => {
      const sessionId = 1;
      jest.spyOn(sesionRepository, 'findOne').mockResolvedValue(mockSesion as Sesion);

      const result = await service.findOne(sessionId);

      expect(result).toEqual(mockSesion);
      expect(sesionRepository.findOne).toHaveBeenCalledWith({
        where: { id: sessionId },
        relations: ['tutor', 'estudiante', 'materia', 'solicitud', 'calificaciones'],
      });
    });

    it('should throw NotFoundException when session not found', async () => {
      const sessionId = 999;
      jest.spyOn(sesionRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(sessionId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('marcarCompletada', () => {
    it('should mark session as completed by assigned tutor', async () => {
      const sessionId = 1;
      const tutorId = 1;
      const updateDto: UpdateSesionDto = { completada: true };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSesion as Sesion);
      jest.spyOn(sesionRepository, 'update').mockResolvedValue({ affected: 1 } as any);

      const result = await service.marcarCompletada(sessionId, tutorId, updateDto);

      expect(sesionRepository.update).toHaveBeenCalledWith(sessionId, updateDto);
      expect(result).toEqual(mockSesion);
    });

    it('should throw BadRequestException when tutor is not assigned to session', async () => {
      const sessionId = 1;
      const wrongTutorId = 2;
      const updateDto: UpdateSesionDto = { completada: true };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSesion as Sesion);

      await expect(service.marcarCompletada(sessionId, wrongTutorId, updateDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when session is already completed', async () => {
      const sessionId = 1;
      const tutorId = 1;
      const updateDto: UpdateSesionDto = { completada: true };
      const completedSession = { ...mockSesion, completada: true };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(completedSession as Sesion);

      await expect(service.marcarCompletada(sessionId, tutorId, updateDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('calificarSesion', () => {
    const createCalificacionDto: CreateCalificacionDto = {
      sesion_id: 1,
      estudiante_id: 1,
      tutor_id: 1,
      calificacion: 5,
      comentario: 'Excelente sesión',
    };

    it('should create a rating for completed session', async () => {
      const completedSession = { ...mockSesion, completada: true };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(completedSession as Sesion);
      jest.spyOn(calificacionRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(calificacionRepository, 'create').mockReturnValue(mockCalificacion as Calificacion);
      jest.spyOn(calificacionRepository, 'save').mockResolvedValue(mockCalificacion as Calificacion);

      const result = await service.calificarSesion(createCalificacionDto);

      expect(result).toEqual(mockCalificacion);
      expect(calificacionRepository.create).toHaveBeenCalledWith(createCalificacionDto);
      expect(calificacionRepository.save).toHaveBeenCalledWith(mockCalificacion);
    });

    it('should throw BadRequestException when session is not completed', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockSesion as Sesion);

      await expect(service.calificarSesion(createCalificacionDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when student is not assigned to session', async () => {
      const completedSession = { ...mockSesion, completada: true };
      const wrongStudentDto = { ...createCalificacionDto, estudiante_id: 2 };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(completedSession as Sesion);

      await expect(service.calificarSesion(wrongStudentDto))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when rating already exists', async () => {
      const completedSession = { ...mockSesion, completada: true };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(completedSession as Sesion);
      jest.spyOn(calificacionRepository, 'findOne').mockResolvedValue(mockCalificacion as Calificacion);

      await expect(service.calificarSesion(createCalificacionDto))
        .rejects.toThrow(BadRequestException);
    });
  });

  describe('getCalificacionesTutor', () => {
    it('should return all ratings for a tutor', async () => {
      const tutorId = 1;
      const mockCalificaciones = [mockCalificacion];
      
      jest.spyOn(calificacionRepository, 'find').mockResolvedValue(mockCalificaciones as Calificacion[]);

      const result = await service.getCalificacionesTutor(tutorId);

      expect(result).toEqual(mockCalificaciones);
      expect(calificacionRepository.find).toHaveBeenCalledWith({
        where: { tutor_id: tutorId },
        relations: ['sesion', 'estudiante', 'tutor'],
        order: { fecha: 'DESC' },
      });
    });
  });

  describe('getEstadisticasTutor', () => {
    it('should return statistics for tutor with ratings', async () => {
      const tutorId = 1;
      const mockCalificaciones = [
        { ...mockCalificacion, calificacion: 5 },
        { ...mockCalificacion, calificacion: 4 },
        { ...mockCalificacion, calificacion: 5 },
      ];
      
      jest.spyOn(service, 'getCalificacionesTutor').mockResolvedValue(mockCalificaciones as Calificacion[]);

      const result = await service.getEstadisticasTutor(tutorId);

      expect(result).toEqual({
        total_calificaciones: 3,
        promedio: 4.67,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 2 }
      });
    });

    it('should return empty statistics when tutor has no ratings', async () => {
      const tutorId = 1;
      
      jest.spyOn(service, 'getCalificacionesTutor').mockResolvedValue([]);

      const result = await service.getEstadisticasTutor(tutorId);

      expect(result).toEqual({
        total_calificaciones: 0,
        promedio: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    });
  });
});