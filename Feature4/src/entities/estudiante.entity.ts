import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Solicitud } from './solicitud.entity';
import { Sesion } from './sesion.entity';
import { Calificacion } from './calificacion.entity';

@Entity('estudiante')
export class Estudiante {
  @PrimaryColumn()
  id: number;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100, nullable: true })
  carrera: string;

  @Column({ nullable: true })
  semestre: number;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @OneToOne(() => Usuario, usuario => usuario.estudiante)
  @JoinColumn({ name: 'id' })
  usuario: Usuario;

  @OneToMany(() => Solicitud, solicitud => solicitud.estudiante)
  solicitudes: Solicitud[];

  @OneToMany(() => Sesion, sesion => sesion.estudiante)
  sesiones: Sesion[];

  @OneToMany(() => Calificacion, calificacion => calificacion.estudiante)
  calificaciones: Calificacion[];
}