import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) {}

  /**
   * Crea un nuevo registro de log en la base de datos.
   * @param logData - Un objeto con los datos del log a crear.
   * @returns La entidad de log guardada.
   */
  async createLog(logData: Partial<Log>): Promise<Log> {
    const newLog = this.logRepository.create(logData);
    return this.logRepository.save(newLog);
  }
}