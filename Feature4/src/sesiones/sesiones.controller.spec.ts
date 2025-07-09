import { Test, TestingModule } from '@nestjs/testing';
import { SesionesController } from './sesiones.controller';
import { SesionesService } from './sesiones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateSesionDto } from './dto/update-sesion.dto';

describe('SesionesController', () => {
  let controller: SesionesController;
  let service: SesionesService;

  const mockSesionesService = {
    findAll: jest.fn(),
    findPasadas: jest.fn(),
    findFuturas: jest.fn(),
    findByTutor: jest.fn(),
    findByEstudiante: jest.fn(),
    findOne: jest.fn(),
    marcarCompletada: jest.fn(),
    calificarSesion: jest.fn(),
    getCalificacionesTutor: jest.fn(),
    getEstadisticasTutor: jest.fn(),
  };

  const mockSesion = {
    id: 1,
    solicitud_id: 1,
    tutor_id: 1,
    estudiante_id: 1,
    materia_id: 1,
    fecha: new Date('2024-01-15'),
    hora: '10:00',
    completada: false,
  };

  const mockCalificacion = {
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
      controllers: [SesionesController],
      providers: [
        {
          provide: SesionesService,
          useValue: mockSesionesService,
        },
      ],
    }).compile();

    controller = module.get<SesionesController>(SesionesController);
    service = module.get<SesionesService>(SesionesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all sessions', async () => {
      const mockSesiones = [mockSesion];
      mockSesionesService.findAll.mockResolvedValue(mockSesiones);

      const result = await controller.findAll();

      expect(result).toEqual(mockSesiones);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findPasadas', () => {
    it('should return past sessions', async () => {
      const mockSesiones = [mockSesion];
      mockSesionesService.findPasadas.mockResolvedValue(mockSesiones);

      const result = await controller.findPasadas();

      expect(result).toEqual(mockSesiones);
      expect(service.findPasadas).toHaveBeenCalled();
    });
  });

  describe('findFuturas', () => {
    it('should return future sessions', async () => {
      const mockSesiones = [mockSesion];
      mockSesionesService.findFuturas.mockResolvedValue(mockSesiones);

      const result = await controller.findFuturas();

      expect(result).toEqual(mockSesiones);
      expect(service.findFuturas).toHaveBeenCalled();
    });
  });

  describe('findByTutor', () => {
    it('should return sessions for a specific tutor', async () => {
      const tutorId = 1;
      const mockSesiones = [mockSesion];
      mockSesionesService.findByTutor.mockResolvedValue(mockSesiones);

      const result = await controller.findByTutor(tutorId);

      expect(result).toEqual(mockSesiones);
      expect(service.findByTutor).toHaveBeenCalledWith(tutorId);
    });
  });

  describe('findByEstudiante', () => {
    it('should return sessions for a specific student', async () => {
      const estudianteId = 1;
      const mockSesiones = [mockSesion];
      mockSesionesService.findByEstudiante.mockResolvedValue(mockSesiones);

      const result = await controller.findByEstudiante(estudianteId);

      expect(result).toEqual(mockSesiones);
      expect(service.findByEstudiante).toHaveBeenCalledWith(estudianteId);
    });
  });

  describe('findOne', () => {
    it('should return a specific session', async () => {
      const sessionId = 1;
      mockSesionesService.findOne.mockResolvedValue(mockSesion);

      const result = await controller.findOne(sessionId);

      expect(result).toEqual(mockSesion);
      expect(service.findOne).toHaveBeenCalledWith(sessionId);
    });
  });

  describe('marcarCompletada', () => {
    it('should mark session as completed', async () => {
      const sessionId = 1;
      const tutorId = 1;
      const updateDto: UpdateSesionDto = { completada: true };
      const updatedSesion = { ...mockSesion, completada: true };
      
      mockSesionesService.marcarCompletada.mockResolvedValue(updatedSesion);

      const result = await controller.marcarCompletada(sessionId, tutorId, updateDto);

      expect(result).toEqual(updatedSesion);
      expect(service.marcarCompletada).toHaveBeenCalledWith(sessionId, tutorId, updateDto);
    });
  });

  describe('calificarSesion', () => {
    it('should create a rating for a session', async () => {
      const createCalificacionDto: CreateCalificacionDto = {
        sesion_id: 1,
        estudiante_id: 1,
        tutor_id: 1,
        calificacion: 5,
        comentario: 'Excelente sesión',
      };
      
      mockSesionesService.calificarSesion.mockResolvedValue(mockCalificacion);

      const result = await controller.calificarSesion(createCalificacionDto);

      expect(result).toEqual(mockCalificacion);
      expect(service.calificarSesion).toHaveBeenCalledWith(createCalificacionDto);
    });
  });

  describe('getCalificacionesTutor', () => {
    it('should return all ratings for a tutor', async () => {
      const tutorId = 1;
      const mockCalificaciones = [mockCalificacion];
      
      mockSesionesService.getCalificacionesTutor.mockResolvedValue(mockCalificaciones);

      const result = await controller.getCalificacionesTutor(tutorId);

      expect(result).toEqual(mockCalificaciones);
      expect(service.getCalificacionesTutor).toHaveBeenCalledWith(tutorId);
    });
  });

  describe('getEstadisticasTutor', () => {
    it('should return statistics for a tutor', async () => {
      const tutorId = 1;
      const mockEstadisticas = {
        total_calificaciones: 5,
        promedio: 4.2,
        distribucion: { 1: 0, 2: 0, 3: 1, 4: 2, 5: 2 }
      };
      
      mockSesionesService.getEstadisticasTutor.mockResolvedValue(mockEstadisticas);

      const result = await controller.getEstadisticasTutor(tutorId);

      expect(result).toEqual(mockEstadisticas);
      expect(service.getEstadisticasTutor).toHaveBeenCalledWith(tutorId);
    });
  });
});