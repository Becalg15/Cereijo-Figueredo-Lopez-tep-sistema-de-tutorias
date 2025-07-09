import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany } from 'typeorm';
import { Solicitud } from './solicitud.entity';
import { Tutor } from './tutor.entity';
import { Estudiante } from './estudiante.entity';
import { Materia } from './materia.entity';
import { Calificacion } from './calificacion.entity';

@Entity('sesion')
export class Sesion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  solicitud_id: number | undefined;

  @Column()
  tutor_id: number | undefined;

  @Column()
  estudiante_id: number | undefined;

  @Column()
  materia_id!: number;

  @Column({ type: 'date' })
  fecha: Date | undefined;

  @Column({ type: 'time' })
  hora: string | undefined;

  @Column({ default: false })
  completada: boolean | undefined;

  @OneToOne(() => Solicitud, solicitud => solicitud.sesion)
  @JoinColumn({ name: 'solicitud_id' })
  solicitud: Solicitud | undefined;

  @ManyToOne(() => Tutor, tutor => tutor.sesiones)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor | undefined;

  @ManyToOne(() => Estudiante, estudiante => estudiante.sesiones)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante | undefined;

  @ManyToOne(() => Materia, materia => materia.sesiones)
  @JoinColumn({ name: 'materia_id' })
  materia!: Materia;

  @OneToMany(() => Calificacion, calificacion => calificacion.sesion)
  calificaciones: Calificacion[] | undefined;
}