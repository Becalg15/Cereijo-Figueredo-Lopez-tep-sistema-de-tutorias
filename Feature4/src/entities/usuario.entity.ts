import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { Estudiante } from './estudiante.entity';
import { Tutor } from './tutor.entity';
import { Coordinador } from './coordinador.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100, unique: true })
  correo: string;

  @Column({ length: 255 })
  contraseña: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fecha_creacion: Date;

  @OneToOne(() => Estudiante, estudiante => estudiante.usuario)
  estudiante: Estudiante;

  @OneToOne(() => Tutor, tutor => tutor.usuario)
  tutor: Tutor;

  @OneToOne(() => Coordinador, coordinador => coordinador.usuario)
  coordinador: Coordinador;
}