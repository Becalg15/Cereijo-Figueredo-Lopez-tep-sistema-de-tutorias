import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  usuario_id: number;

  @Column({ length: 100 })
  accion: string;

  @Column({ length: 100, nullable: true })
  ruta: string;

  @Column({ length: 10, nullable: true })
  metodo: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}