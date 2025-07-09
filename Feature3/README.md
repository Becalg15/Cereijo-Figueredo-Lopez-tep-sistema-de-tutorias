# Sistema de Tutorías Académicas Universitarias

Sistema de gestión de tutorías académicas desarrollado con NestJS, TypeScript, TypeORM y PostgreSQL. Permite gestionar solicitudes de tutoría, asignación de tutores y programación de sesiones.

## Características Principales

- **Gestión de Solicitudes**: Los estudiantes pueden crear solicitudes de tutoría
- **Asignación Automática**: Sistema automático de asignación de tutores disponibles
- **Gestión de Sesiones**: Conversión automática de solicitudes aceptadas en sesiones programadas
- **Estados de Seguimiento**: Control completo del flujo de estados de solicitudes
- **API REST**: Endpoints completos para todas las operaciones

## Tecnologías Utilizadas

- **Backend**: NestJS + TypeScript
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL
- **Validación**: class-validator + class-transformer

## Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- PostgreSQL (versión 12 o superior)
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**:
```bash
npm install
```

2. **Configurar base de datos**:
   - Crear una base de datos PostgreSQL llamada `tutorias_db`
   - Ejecutar el script SQL proporcionado para crear las tablas
   - Configurar las credenciales en el archivo `.env`

3. **Configurar variables de entorno**:
   - Editar el archivo `.env` con tus credenciales de base de datos
   - Ejemplo:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=tutorias_db
```

4. **Iniciar el servidor**:
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

## Funcionalidades Implementadas

### 1. Gestión de Solicitudes de Tutoría

**Crear Solicitud**:
- Endpoint: `POST /solicitudes`
- Función: Permite a un estudiante crear una solicitud de tutoría
- Proceso: Valida datos, busca tutor disponible, asigna automáticamente

**Ver Solicitudes**:
- `GET /solicitudes` - Todas las solicitudes
- `GET /solicitudes/tutor/:tutorId` - Solicitudes de un tutor específico
- `GET /solicitudes/estudiante/:estudianteId` - Solicitudes de un estudiante

### 2. Gestión de Tutores

**Aceptar/Rechazar Solicitudes**:
- `POST /sesiones/aceptar/:solicitudId` - Acepta solicitud y crea sesión
- `POST /sesiones/rechazar/:solicitudId` - Rechaza solicitud

**Ver Solicitudes Asignadas**:
- `GET /solicitudes/tutor/:tutorId` - Lista solicitudes pendientes del tutor

### 3. Gestión de Sesiones

**Crear Sesiones**:
- Endpoint: `POST /sesiones`
- Función: Crea sesión a partir de solicitud aceptada
- Proceso automático: Se ejecuta al aceptar una solicitud

**Gestionar Sesiones**:
- `GET /sesiones` - Todas las sesiones
- `PUT /sesiones/:id/completar` - Marcar sesión como completada
- `PATCH /sesiones/:id` - Actualizar detalles de sesión

## Uso desde Terminal

### Ejemplos de Comandos cURL

#### 1. Crear una solicitud de tutoría
```bash
curl -X POST http://localhost:3000/solicitudes \
  -H "Content-Type: application/json" \
  -d '{
    "estudiante_id": 1,
    "materia_id": 1,
    "fecha_solicitada": "2024-01-15",
    "hora_solicitada": "14:00"
  }'
```

#### 2. Ver solicitudes de un tutor
```bash
curl http://localhost:3000/solicitudes/tutor/1
```

#### 3. Aceptar una solicitud (crea sesión automáticamente)
```bash
curl -X POST http://localhost:3000/sesiones/aceptar/1
```

#### 4. Rechazar una solicitud
```bash
curl -X POST http://localhost:3000/sesiones/rechazar/1
```

#### 5. Ver todas las sesiones
```bash
curl http://localhost:3000/sesiones
```

#### 6. Marcar sesión como completada
```bash
curl -X PUT http://localhost:3000/sesiones/1/completar
```

## Flujo de Estados

### Estados de Solicitud:
1. **PENDIENTE**: Solicitud recién creada
2. **ASIGNADA**: Tutor asignado automáticamente
3. **ACEPTADA**: Tutor acepta la solicitud
4. **RECHAZADA**: Tutor rechaza la solicitud
5. **COMPLETADA**: Sesión creada y/o completada

### Transiciones Válidas:
- PENDIENTE → ASIGNADA (automático)
- ASIGNADA → ACEPTADA (tutor acepta)
- ASIGNADA → RECHAZADA (tutor rechaza)
- ACEPTADA → COMPLETADA (sesión creada)

## Estructura del Proyecto

```
src/
├── database/
│   ├── entities/          # Entidades TypeORM
│   └── database.module.ts # Configuración de DB
├── solicitud/
│   ├── dto/              # DTOs de validación
│   ├── solicitud.service.ts
│   ├── solicitud.controller.ts
│   └── solicitud.module.ts
├── sesion/
│   ├── dto/              # DTOs de validación
│   ├── sesion.service.ts
│   ├── sesion.controller.ts
│   └── sesion.module.ts
├── app.module.ts         # Módulo principal
└── main.ts              # Punto de entrada
```

## Comandos Disponibles

```bash
# Desarrollo
npm run start:dev    # Inicia servidor en modo desarrollo

# Producción
npm run build        # Construye la aplicación
npm run start        # Inicia servidor en producción

# Utilidades
npm run test         # Ejecuta pruebas (placeholder)
```

## Endpoints de la API

### Solicitudes (`/solicitudes`)
- `POST /` - Crear solicitud
- `GET /` - Listar todas las solicitudes
- `GET /:id` - Obtener solicitud específica
- `GET /tutor/:tutorId` - Solicitudes de un tutor
- `GET /estudiante/:estudianteId` - Solicitudes de un estudiante
- `PATCH /:id` - Actualizar solicitud
- `DELETE /:id` - Eliminar solicitud

### Sesiones (`/sesiones`)
- `POST /` - Crear sesión
- `POST /aceptar/:solicitudId` - Aceptar solicitud
- `POST /rechazar/:solicitudId` - Rechazar solicitud
- `GET /` - Listar todas las sesiones
- `GET /:id` - Obtener sesión específica
- `GET /tutor/:tutorId` - Sesiones de un tutor
- `GET /estudiante/:estudianteId` - Sesiones de un estudiante
- `PATCH /:id` - Actualizar sesión
- `PUT /:id/completar` - Marcar sesión completada
- `DELETE /:id` - Eliminar sesión

## Validaciones

- **Fechas**: Formato ISO (YYYY-MM-DD)
- **Horas**: Formato 24h (HH:MM)
- **IDs**: Números enteros positivos
- **Estados**: Solo transiciones válidas permitidas

## Consideraciones de Seguridad

- Validación de datos de entrada
- Verificación de existencia de entidades
- Control de transiciones de estado
- Manejo de errores consistente

## Datos de Prueba

Para probar el sistema, necesitarás insertar datos de prueba en las tablas:
- `usuario` (usuarios base)
- `estudiante` (estudiantes)
- `tutor` (tutores)
- `materia` (materias/asignaturas)

## Soporte

Para reportar problemas o solicitar características:
- Revisar logs del servidor
- Verificar configuración de base de datos
- Validar formato de datos en requests

## Notas Técnicas

- La asignación de tutores es automática basada en la materia
- Las sesiones se crean automáticamente al aceptar solicitudes
- El sistema mantiene trazabilidad completa de estados
- Todas las operaciones incluyen validaciones de negocio