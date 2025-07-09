import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Sesion } from './sesion.entity';
import { Estudiante } from './estudiante.entity';
import { Tutor } from './tutor.entity';

@Entity('calificacion')
export class Calificacion {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column()
  sesion_id: number | undefined;

  @Column()
  estudiante_id: number | undefined;

  @Column()
  tutor_id: number | undefined;

  @Column({ type: 'int' })
  calificacion: number | undefined;

  @Column({ type: 'text', nullable: true })
  comentario: string | undefined;

  @CreateDateColumn()
  fecha: Date | undefined;

  @ManyToOne(() => Sesion, sesion => sesion.calificaciones)
  @JoinColumn({ name: 'sesion_id' })
  sesion: Sesion | undefined;

  @ManyToOne(() => Estudiante, estudiante => estudiante.calificaciones)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante | undefined;

  @ManyToOne(() => Tutor, tutor => tutor.calificaciones)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor | undefined;
}