import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Materia } from './materia.entity';
import { Tutor } from './tutor.entity';
import { Sesion } from './sesion.entity';

@Entity('solicitud')
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  estudiante_id: number;

  @Column()
  materia_id: number;

  @Column({ type: 'date' })
  fecha_solicitada: Date;

  @Column({ type: 'time' })
  hora_solicitada: string;

  @Column({ length: 20 })
  estado: string;

  @Column({ nullable: true })
  tutor_id: number;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => Estudiante, estudiante => estudiante.solicitudes)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Materia, materia => materia.solicitudes)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @ManyToOne(() => Tutor, tutor => tutor.solicitudes)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @OneToOne(() => Sesion, sesion => sesion.solicitud)
  sesion: Sesion;
}