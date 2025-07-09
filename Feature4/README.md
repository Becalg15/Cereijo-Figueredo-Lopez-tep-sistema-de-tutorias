# Sistema de Tutorías Académicas - Módulo de Sesiones

Este es un sistema de tutorías académicas universitarias implementado con NestJS, TypeScript, TypeORM y PostgreSQL. Se enfoca específicamente en la gestión de sesiones de tutoría.

## Características Principales

### 🎯 Funcionalidades Implementadas

1. **Listado de Sesiones**
   - Obtener todas las sesiones
   - Filtrar sesiones pasadas y futuras
   - Buscar sesiones por tutor o estudiante

2. **Gestión de Sesiones por Tutores**
   - Marcar sesiones como completadas
   - Solo el tutor asignado puede completar su sesión

3. **Sistema de Calificaciones**
   - Estudiantes pueden calificar sesiones completadas
   - Calificación del 1 al 5 con comentarios opcionales
   - Estadísticas de calificaciones por tutor

## 🛠 Tecnologías Utilizadas

- **Lenguaje**: TypeScript
- **Framework**: NestJS
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL
- **Validación**: class-validator

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio e instalar dependencias:**
```bash
npm install
```

2. **Configurar base de datos:**
```bash
# Copiar archivo de configuración
cp .env.example .env

# Editar .env con tus credenciales de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tutoring_system
```

3. **Ejecutar el esquema de base de datos**
Ejecuta el script SQL proporcionado en tu base de datos PostgreSQL para crear todas las tablas necesarias.

## 🏃‍♂️ Uso

### Iniciar el servidor de desarrollo:
```bash
npm run start:dev
```

### Iniciar el servidor de producción:
```bash
npm run build
npm run start
```

### Ejecutar en modo debug:
```bash
npm run start:debug
```

## 🧪 Testing

### Ejecutar todas las pruebas:
```bash
npm test
```

### Ejecutar pruebas en modo watch:
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura:
```bash
npm run test:coverage
```

### Ejecutar pruebas end-to-end:
```bash
npm run test:e2e
```

### Ejecutar pruebas en modo debug:
```bash
npm run test:debug
```

## 📊 Cobertura de Pruebas

Las pruebas incluyen:

### Pruebas Unitarias (`*.spec.ts`)
- **SesionesService**: Pruebas de lógica de negocio
  - Obtención de sesiones (todas, pasadas, futuras)
  - Filtrado por tutor y estudiante
  - Marcado de sesiones como completadas
  - Sistema de calificaciones
  - Cálculo de estadísticas
  - Validaciones de negocio

- **SesionesController**: Pruebas de endpoints
  - Validación de parámetros
  - Manejo de respuestas
  - Integración con el servicio

### Pruebas End-to-End (`*.e2e-spec.ts`)
- Pruebas de integración completa
- Validación de endpoints HTTP
- Manejo de errores HTTP
- Validación de DTOs
- Respuestas de la API

### Casos de Prueba Cubiertos

✅ **Gestión de Sesiones**
- Listado completo de sesiones
- Filtrado por fechas (pasadas/futuras)
- Búsqueda por tutor/estudiante
- Obtención de sesión específica
- Manejo de sesiones no encontradas

✅ **Completar Sesiones**
- Validación de tutor asignado
- Prevención de doble completado
- Actualización correcta del estado

✅ **Sistema de Calificaciones**
- Validación de sesión completada
- Verificación de estudiante autorizado
- Prevención de calificaciones duplicadas
- Validación de rango de calificación (1-5)
- Comentarios opcionales

✅ **Estadísticas**
- Cálculo de promedios
- Distribución de calificaciones
- Manejo de tutores sin calificaciones

✅ **Validaciones HTTP**
- Parámetros inválidos
- Cuerpos de petición malformados
- Campos requeridos faltantes
- Códigos de estado HTTP correctos

## 🔌 Endpoints de la API

### Gestión de Sesiones

#### GET /sesiones
**Descripción**: Obtiene todas las sesiones
**Respuesta**: Lista de sesiones con relaciones completas

#### GET /sesiones/pasadas
**Descripción**: Obtiene sesiones anteriores a hoy
**Respuesta**: Lista de sesiones pasadas ordenadas por fecha descendente

#### GET /sesiones/futuras
**Descripción**: Obtiene sesiones de hoy en adelante
**Respuesta**: Lista de sesiones futuras ordenadas por fecha ascendente

#### GET /sesiones/tutor/:tutorId
**Descripción**: Obtiene sesiones de un tutor específico
**Parámetros**: 
- `tutorId`: ID del tutor
**Respuesta**: Lista de sesiones del tutor

#### GET /sesiones/estudiante/:estudianteId
**Descripción**: Obtiene sesiones de un estudiante específico
**Parámetros**: 
- `estudianteId`: ID del estudiante
**Respuesta**: Lista de sesiones del estudiante

#### GET /sesiones/:id
**Descripción**: Obtiene una sesión específica
**Parámetros**: 
- `id`: ID de la sesión
**Respuesta**: Detalles completos de la sesión

#### PUT /sesiones/:id/completar?tutorId={tutorId}
**Descripción**: Marca una sesión como completada (solo tutores)
**Parámetros**: 
- `id`: ID de la sesión
- `tutorId`: ID del tutor (query parameter)
**Body**:
```json
{
  "completada": true
}
```

### Sistema de Calificaciones

#### POST /sesiones/calificar
**Descripción**: Permite al estudiante calificar una sesión completada
**Body**:
```json
{
  "sesion_id": 1,
  "estudiante_id": 1,
  "tutor_id": 1,
  "calificacion": 5,
  "comentario": "Excelente sesión"
}
```

#### GET /sesiones/calificaciones/tutor/:tutorId
**Descripción**: Obtiene todas las calificaciones de un tutor
**Parámetros**: 
- `tutorId`: ID del tutor
**Respuesta**: Lista de calificaciones con detalles

#### GET /sesiones/estadisticas/tutor/:tutorId
**Descripción**: Obtiene estadísticas de calificaciones de un tutor
**Parámetros**: 
- `tutorId`: ID del tutor
**Respuesta**:
```json
{
  "total_calificaciones": 10,
  "promedio": 4.5,
  "distribucion": {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4
  }
}
```

## 📊 Ejemplos de Uso con curl

### Obtener todas las sesiones
```bash
curl -X GET http://localhost:3000/sesiones
```

### Obtener sesiones futuras
```bash
curl -X GET http://localhost:3000/sesiones/futuras
```

### Marcar sesión como completada
```bash
curl -X PUT "http://localhost:3000/sesiones/1/completar?tutorId=1" \
  -H "Content-Type: application/json" \
  -d '{"completada": true}'
```

### Calificar una sesión
```bash
curl -X POST http://localhost:3000/sesiones/calificar \
  -H "Content-Type: application/json" \
  -d '{
    "sesion_id": 1,
    "estudiante_id": 1,
    "tutor_id": 1,
    "calificacion": 5,
    "comentario": "Excelente sesión"
  }'
```

### Obtener estadísticas de un tutor
```bash
curl -X GET http://localhost:3000/sesiones/estadisticas/tutor/1
```

## 🔒 Validaciones Implementadas

### Validaciones de Negocio
- Solo tutores asignados pueden marcar sesiones como completadas
- Solo sesiones completadas pueden ser calificadas
- Solo estudiantes de la sesión pueden calificarla
- No se permite calificar la misma sesión dos veces
- Calificaciones deben estar entre 1 y 5

### Validaciones de Datos
- Todos los IDs deben ser números enteros
- Calificaciones deben ser números entre 1 y 5
- Comentarios son opcionales pero deben ser strings

## 📁 Estructura del Proyecto

```
src/
├── entities/           # Entidades TypeORM
│   ├── usuario.entity.ts
│   ├── estudiante.entity.ts
│   ├── tutor.entity.ts
│   ├── coordinador.entity.ts
│   ├── materia.entity.ts
│   ├── solicitud.entity.ts
│   ├── sesion.entity.ts
│   ├── calificacion.entity.ts
│   └── log.entity.ts
├── sesiones/           # Módulo de sesiones
│   ├── dto/           # Data Transfer Objects
│   │   ├── create-calificacion.dto.ts
│   │   └── update-sesion.dto.ts
│   ├── sesiones.controller.ts
│   ├── sesiones.service.ts
│   └── sesiones.module.ts
├── app.module.ts      # Módulo principal
└── main.ts           # Punto de entrada
```

## 🎯 Funciones Clave del Sistema

### SesionesService
- `findAll()`: Obtiene todas las sesiones con relaciones
- `findPasadas()`: Filtra sesiones anteriores a hoy
- `findFuturas()`: Filtra sesiones de hoy en adelante
- `findByTutor(tutorId)`: Sesiones de un tutor específico
- `findByEstudiante(estudianteId)`: Sesiones de un estudiante específico
- `marcarCompletada(id, tutorId, dto)`: Marca sesión como completada
- `calificarSesion(dto)`: Permite calificar una sesión
- `getCalificacionesTutor(tutorId)`: Obtiene calificaciones de un tutor
- `getEstadisticasTutor(tutorId)`: Calcula estadísticas de calificaciones

### Características Avanzadas
- Relaciones automáticas con TypeORM
- Validación de datos con class-validator
- Manejo de errores con excepciones específicas
- Consultas optimizadas con filtros de fechas
- Cálculo automático de estadísticas

## 🔧 Configuración

El sistema usa variables de entorno para configuración:
- `DB_HOST`: Host de PostgreSQL
- `DB_PORT`: Puerto de PostgreSQL
- `DB_USERNAME`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos
- `PORT`: Puerto del servidor (por defecto 3000)
- `NODE_ENV`: Entorno de ejecución

## 📝 Notas Importantes

1. **Seguridad**: En producción, implementar autenticación y autorización
2. **Validaciones**: El sistema valida que solo usuarios autorizados puedan realizar ciertas acciones
3. **Relaciones**: Todas las entidades están correctamente relacionadas según el esquema
4. **Fechas**: Se maneja correctamente la diferencia entre sesiones pasadas y futuras
5. **Estadísticas**: Se calculan en tiempo real las estadísticas de calificaciones

## 🚀 Próximos Pasos

Para un sistema completo, considera implementar:
- Autenticación JWT
- Autorización basada en roles
- Logging de auditoría
- Notificaciones
- Paginación en listados
- Búsqueda avanzada
- Reportes detallados