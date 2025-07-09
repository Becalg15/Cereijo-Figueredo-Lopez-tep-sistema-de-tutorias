import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Tutor } from './tutor.entity';
import { Solicitud } from './solicitud.entity';
import { Sesion } from './sesion.entity';

@Entity('materia')
export class Materia {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ length: 100 })
  nombre: string | undefined;

  @Column({ length: 20, unique: true })
  codigo: string | undefined;

  @OneToMany(() => Tutor, tutor => tutor.materia)
  tutores: Tutor[] | undefined;

  @OneToMany(() => Solicitud, solicitud => solicitud.materia)
  solicitudes: Solicitud[] | undefined;

  @OneToMany(() => Sesion, sesion => sesion.materia)
  sesiones: Sesion[] | undefined;
}