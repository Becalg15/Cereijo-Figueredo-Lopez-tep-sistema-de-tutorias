import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Materia } from './materia.entity';
import { Solicitud } from './solicitud.entity';
import { Sesion } from './sesion.entity';
import { Calificacion } from './calificacion.entity';

@Entity('tutor')
export class Tutor {
  @PrimaryColumn()
  id: number | undefined;

  @Column({ length: 20, unique: true })
  cedula: string | undefined; 

  @Column({ length: 100, nullable: true })
  profesion: string | undefined;

  @Column({ type: 'text', nullable: true })
  experiencia: string | undefined;

  @Column({ length: 20, nullable: true })
  telefono: string | undefined;

  @Column({ nullable: true })
  materia_id!: number;

  @OneToOne(() => Usuario, usuario => usuario.tutor)
  @JoinColumn({ name: 'id' })
  usuario: Usuario | undefined;

  @ManyToOne(() => Materia, materia => materia.tutores)
  @JoinColumn({ name: 'materia_id' })
  materia!: Materia;

  @OneToMany(() => Solicitud, solicitud => solicitud.tutor)
  solicitudes: Solicitud[] | undefined;

  @OneToMany(() => Sesion, sesion => sesion.tutor)
  sesiones: Sesion[] | undefined;

  @OneToMany(() => Calificacion, calificacion => calificacion.tutor)
  calificaciones: Calificacion[] | undefined;
}