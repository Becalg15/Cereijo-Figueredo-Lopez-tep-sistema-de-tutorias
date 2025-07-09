import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Materia } from './materia.entity';
import { Solicitud } from './solicitud.entity';
import { Sesion } from './sesion.entity';
import { Calificacion } from './calificacion.entity';

@Entity('tutor')
export class Tutor {
  @PrimaryColumn()
  id: number;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100, nullable: true })
  profesion: string;

  @Column({ type: 'text', nullable: true })
  experiencia: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column()
  materia_id: number;

  @OneToOne(() => Usuario, usuario => usuario.tutor)
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @ManyToOne(() => Materia, materia => materia.tutores)
  @JoinColumn({ name: 'materia_id' })
  materia: Materia;

  @OneToMany(() => Solicitud, solicitud => solicitud.tutor)
  solicitudes: Solicitud[];

  @OneToMany(() => Sesion, sesion => sesion.tutor)
  sesiones: Sesion[];

  @OneToMany(() => Calificacion, calificacion => calificacion.tutor)
  calificaciones: Calificacion[];
}