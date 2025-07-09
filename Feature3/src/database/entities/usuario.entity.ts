import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Tutor } from './tutor.entity';
import { Coordinador } from './coordinador.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ length: 100 })
  nombre: string | undefined;

  @Column({ length: 100, unique: true })
  correo: string | undefined;

  @Column({ length: 255 })
  contraseña: string | undefined;

  @Column({ default: true })
  activo: boolean | undefined;

  @CreateDateColumn()
  fecha_creacion: Date | undefined;

  @OneToOne(() => Estudiante, estudiante => estudiante.usuario)
  estudiante: Estudiante | undefined;

  @OneToOne(() => Tutor, tutor => tutor.usuario)
  tutor: Tutor | undefined;

  @OneToOne(() => Coordinador, coordinador => coordinador.usuario)
  coordinador: Coordinador | undefined;
}