import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Solicitud } from './solicitud.entity';
import { Sesion } from './sesion.entity';
import { Calificacion } from './calificacion.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryColumn()
  id: number | undefined;

  @Column({ length: 20, unique: true })
  cedula: string | undefined;

  @Column({ length: 100, nullable: true })
  carrera: string | undefined;

  @Column({ nullable: true })
  semestre: number | undefined;

  @Column({ length: 20, nullable: true })
  telefono: string | undefined;

  @OneToOne(() => Usuario, usuario => usuario.estudiante)
  @JoinColumn({ name: 'id' })
  usuario: Usuario | undefined;

  @OneToMany(() => Solicitud, solicitud => solicitud.estudiante)
  solicitudes: Solicitud[] | undefined;

  @OneToMany(() => Sesion, sesion => sesion.estudiante)
  sesiones: Sesion[] | undefined;

  @OneToMany(() => Calificacion, calificacion => calificacion.estudiante)
  calificaciones: Calificacion[] | undefined;
}