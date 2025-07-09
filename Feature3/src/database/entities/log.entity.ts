import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  usuario_id: number | undefined;

  @Column({ length: 100 })
  accion: string | undefined;

  @Column({ length: 100, nullable: true })
  ruta: string | undefined;

  @Column({ length: 10, nullable: true })
  metodo: string | undefined;

  @CreateDateColumn()
  timestamp: Date | undefined;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | undefined;
}