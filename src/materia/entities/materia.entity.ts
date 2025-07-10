import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { SesionTutoria } from '../../sesion-tutoria/entities/sesion-tutoria.entity';

@Entity('materia')
export class Materia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 20, unique: true })
  codigo: string;

  @OneToMany(() => SesionTutoria, (sesion) => sesion.materia)
  sesiones: SesionTutoria[];
}