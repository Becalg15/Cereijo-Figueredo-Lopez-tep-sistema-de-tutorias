import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tutor } from './tutor.entity';
import { Solicitud } from './solicitud.entity';
import { Sesion } from './sesion.entity';

@Entity('materia')
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 20, unique: true })
  codigo: string;

  @OneToMany(() => Tutor, tutor => tutor.materia)
  tutores: Tutor[];

  @OneToMany(() => Solicitud, solicitud => solicitud.materia)
  solicitudes: Solicitud[];

  @OneToMany(() => Sesion, sesion => sesion.materia)
  sesiones: Sesion[];
}