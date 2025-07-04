import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LogService } from '../log.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}

  /**
   * Método que será invocado por NestJS para cada petición manejada.
   * @param context - Proporciona detalles sobre la petición actual.
   * @param next - Un manejador que permite invocar el siguiente interceptor o el manejador de ruta.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, path } = request;

    // NOTA IMPORTANTE:
    // Como esta feature se construye de forma independiente, no podemos asumir
    // que la autenticación (req.user) ya existe.
    // Por ello, obtenemos el ID de usuario de forma segura. Si no existe,
    // usaremos un valor por defecto (ej: 0) para indicar una acción anónima o no autenticada.
    const userId = request.user?.id || 0; // 0 para usuarios no autenticados

    const action = `Petición a la ruta: ${path}`;

    // Usamos `tap` para realizar una acción secundaria (el logging) sin
    // modificar la respuesta que se le envía al cliente.
    return next.handle().pipe(
      tap(() => {
        this.logService.createLog({
          usuarioId: userId,
          accion: action,
          ruta: path,
          metodo: method,
        });
      }),
    );
  }
}