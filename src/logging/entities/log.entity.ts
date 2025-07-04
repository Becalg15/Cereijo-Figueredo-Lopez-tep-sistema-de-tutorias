import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../users/entities/usuario.entity';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id', type: 'integer', nullable: false })
  usuarioId: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  accion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ruta: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  metodo: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  // Relación muchos a uno con la entidad Usuario
  // Esto establece el vínculo de la clave foránea 'usuario_id'
  @ManyToOne(() => Usuario, (usuario) => usuario.logs)
  @JoinColumn({ name: 'usuario_id' }) // Especifica la columna de la clave foránea
  usuario: Usuario;
}