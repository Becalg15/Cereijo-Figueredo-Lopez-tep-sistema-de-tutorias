import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sesion } from '../src/entities/sesion.entity';
import { Calificacion } from '../src/entities/calificacion.entity';

describe('SesionesController (e2e)', () => {
  let app: INestApplication;
  let sesionRepository: any;
  let calificacionRepository: any;

  const mockSesion = {
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
    },
    estudiante: {
      id: 1,
      cedula: '87654321',
      carrera: 'Ingeniería',
      semestre: 5,
      telefono: '987654321',
    },
    materia: {
      id: 1,
      nombre: 'Matemáticas',
      codigo: 'MAT101',
    },
    calificaciones: [],
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
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(getRepositoryToken(Sesion))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(Calificacion))
      .useValue({
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    sesionRepository = moduleFixture.get(getRepositoryToken(Sesion));
    calificacionRepository = moduleFixture.get(getRepositoryToken(Calificacion));
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/sesiones (GET)', () => {
    it('should return all sessions', () => {
      const mockSesiones = [mockSesion];
      sesionRepository.find.mockResolvedValue(mockSesiones);

      return request(app.getHttpServer())
        .get('/sesiones')
        .expect(200)
        .expect(mockSesiones);
    });
  });

  describe('/sesiones/pasadas (GET)', () => {
    it('should return past sessions', () => {
      const mockSesiones = [mockSesion];
      sesionRepository.find.mockResolvedValue(mockSesiones);

      return request(app.getHttpServer())
        .get('/sesiones/pasadas')
        .expect(200)
        .expect(mockSesiones);
    });
  });

  describe('/sesiones/futuras (GET)', () => {
    it('should return future sessions', () => {
      const mockSesiones = [mockSesion];
      sesionRepository.find.mockResolvedValue(mockSesiones);

      return request(app.getHttpServer())
        .get('/sesiones/futuras')
        .expect(200)
        .expect(mockSesiones);
    });
  });

  describe('/sesiones/tutor/:tutorId (GET)', () => {
    it('should return sessions for a specific tutor', () => {
      const tutorId = 1;
      const mockSesiones = [mockSesion];
      sesionRepository.find.mockResolvedValue(mockSesiones);

      return request(app.getHttpServer())
        .get(`/sesiones/tutor/${tutorId}`)
        .expect(200)
        .expect(mockSesiones);
    });

    it('should return 400 for invalid tutor ID', () => {
      return request(app.getHttpServer())
        .get('/sesiones/tutor/invalid')
        .expect(400);
    });
  });

  describe('/sesiones/estudiante/:estudianteId (GET)', () => {
    it('should return sessions for a specific student', () => {
      const estudianteId = 1;
      const mockSesiones = [mockSesion];
      sesionRepository.find.mockResolvedValue(mockSesiones);

      return request(app.getHttpServer())
        .get(`/sesiones/estudiante/${estudianteId}`)
        .expect(200)
        .expect(mockSesiones);
    });

    it('should return 400 for invalid student ID', () => {
      return request(app.getHttpServer())
        .get('/sesiones/estudiante/invalid')
        .expect(400);
    });
  });

  describe('/sesiones/:id (GET)', () => {
    it('should return a specific session', () => {
      const sessionId = 1;
      sesionRepository.findOne.mockResolvedValue(mockSesion);

      return request(app.getHttpServer())
        .get(`/sesiones/${sessionId}`)
        .expect(200)
        .expect(mockSesion);
    });

    it('should return 404 when session not found', () => {
      const sessionId = 999;
      sesionRepository.findOne.mockResolvedValue(null);

      return request(app.getHttpServer())
        .get(`/sesiones/${sessionId}`)
        .expect(404);
    });
  });

  describe('/sesiones/:id/completar (PUT)', () => {
    it('should mark session as completed', () => {
      const sessionId = 1;
      const tutorId = 1;
      const updatedSesion = { ...mockSesion, completada: true };
      
      sesionRepository.findOne.mockResolvedValue(mockSesion);
      sesionRepository.update.mockResolvedValue({ affected: 1 });
      sesionRepository.findOne.mockResolvedValueOnce(updatedSesion);

      return request(app.getHttpServer())
        .put(`/sesiones/${sessionId}/completar?tutorId=${tutorId}`)
        .send({ completada: true })
        .expect(200);
    });

    it('should return 400 when tutorId is missing', () => {
      const sessionId = 1;

      return request(app.getHttpServer())
        .put(`/sesiones/${sessionId}/completar`)
        .send({ completada: true })
        .expect(400);
    });

    it('should return 400 for invalid request body', () => {
      const sessionId = 1;
      const tutorId = 1;

      return request(app.getHttpServer())
        .put(`/sesiones/${sessionId}/completar?tutorId=${tutorId}`)
        .send({ completada: 'invalid' })
        .expect(400);
    });
  });

  describe('/sesiones/calificar (POST)', () => {
    it('should create a rating for a session', () => {
      const createCalificacionDto = {
        sesion_id: 1,
        estudiante_id: 1,
        tutor_id: 1,
        calificacion: 5,
        comentario: 'Excelente sesión',
      };
      
      const completedSesion = { ...mockSesion, completada: true };
      sesionRepository.findOne.mockResolvedValue(completedSesion);
      calificacionRepository.findOne.mockResolvedValue(null);
      calificacionRepository.create.mockReturnValue(mockCalificacion);
      calificacionRepository.save.mockResolvedValue(mockCalificacion);

      return request(app.getHttpServer())
        .post('/sesiones/calificar')
        .send(createCalificacionDto)
        .expect(201)
        .expect(mockCalificacion);
    });

    it('should return 400 for invalid rating data', () => {
      const invalidDto = {
        sesion_id: 1,
        estudiante_id: 1,
        tutor_id: 1,
        calificacion: 6, // Invalid: should be between 1-5
        comentario: 'Excelente sesión',
      };

      return request(app.getHttpServer())
        .post('/sesiones/calificar')
        .send(invalidDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      const incompleteDto = {
        sesion_id: 1,
        // Missing required fields
      };

      return request(app.getHttpServer())
        .post('/sesiones/calificar')
        .send(incompleteDto)
        .expect(400);
    });
  });

  describe('/sesiones/calificaciones/tutor/:tutorId (GET)', () => {
    it('should return all ratings for a tutor', () => {
      const tutorId = 1;
      const mockCalificaciones = [mockCalificacion];
      calificacionRepository.find.mockResolvedValue(mockCalificaciones);

      return request(app.getHttpServer())
        .get(`/sesiones/calificaciones/tutor/${tutorId}`)
        .expect(200)
        .expect(mockCalificaciones);
    });
  });

  describe('/sesiones/estadisticas/tutor/:tutorId (GET)', () => {
    it('should return statistics for a tutor', () => {
      const tutorId = 1;
      const mockCalificaciones = [
        { ...mockCalificacion, calificacion: 5 },
        { ...mockCalificacion, calificacion: 4 },
        { ...mockCalificacion, calificacion: 5 },
      ];
      const expectedStats = {
        total_calificaciones: 3,
        promedio: 4.67,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 1, 5: 2 }
      };
      
      calificacionRepository.find.mockResolvedValue(mockCalificaciones);

      return request(app.getHttpServer())
        .get(`/sesiones/estadisticas/tutor/${tutorId}`)
        .expect(200)
        .expect(expectedStats);
    });

    it('should return empty statistics when tutor has no ratings', () => {
      const tutorId = 1;
      const expectedStats = {
        total_calificaciones: 0,
        promedio: 0,
        distribucion: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
      
      calificacionRepository.find.mockResolvedValue([]);

      return request(app.getHttpServer())
        .get(`/sesiones/estadisticas/tutor/${tutorId}`)
        .expect(200)
        .expect(expectedStats);
    });
  });
});