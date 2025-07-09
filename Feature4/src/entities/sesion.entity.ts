import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { Tutor } from './tutor.entity';
import { Estudiante } from './estudiante.entity';
import { Materia } from './materia.entity';
import { Calificacion } from './calificacion.entity';

@Entity('sesion')
export class Sesion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  solicitud_id: number;

  @Column()
  tutor_id: number;

  @Column()
  estudiante_id: number;

  @Column()
  materia_id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'time' })
  hora: string;

  @Column({ default: false })
  completada: boolean;

  @OneToOne(() => Solicitud, solicitud => solicitud.sesion)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud;

  @ManyToOne(() => Tutor, tutor => tutor.sesiones)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;

  @ManyToOne(() => Estudiante, estudiante => estudiante.sesiones)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Materia, materia => materia.sesiones)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @OneToMany(() => Calificacion, calificacion => calificacion.sesion)
  calificaciones: Calificacion[];
}