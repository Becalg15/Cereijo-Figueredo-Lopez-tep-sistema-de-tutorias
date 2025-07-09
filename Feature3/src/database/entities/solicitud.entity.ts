import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, CreateDateColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Materia } from './materia.entity';
import { Tutor } from './tutor.entity';
import { Sesion } from './sesion.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'PENDIENTE',
  ASIGNADA = 'ASIGNADA',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA',
  COMPLETADA = 'COMPLETADA'
}

@Entity('solicitud')
export class Solicitud {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  estudiante_id:  number | undefined ;

  @Column()
  materia_id!: number;

  @Column({ type: 'date' })
  fecha_solicitada!: Date;

  @Column({ type: 'time' })
  hora_solicitada!: string;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.PENDIENTE
  })
  estado!: EstadoSolicitud;

  @Column({ nullable: true })
  tutor_id: number | undefined;

  @CreateDateColumn()
  fecha_creacion: Date | undefined;

  @ManyToOne(() => Estudiante, estudiante => estudiante.solicitudes)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante | undefined;

  @ManyToOne(() => Materia, materia => materia.solicitudes)
  @JoinColumn({ name: 'materia_id' })
  materia!: Materia;

  @ManyToOne(() => Tutor, tutor => tutor.solicitudes)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor | undefined;

  @OneToOne(() => Sesion, sesion => sesion.solicitud)
  sesion: Sesion | undefined;
}