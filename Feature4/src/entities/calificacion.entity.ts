import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, Check } from 'typeorm';
import { Sesion } from './sesion.entity';
import { Estudiante } from './estudiante.entity';
import { Tutor } from './tutor.entity';

@Entity('calificacion')
@Check('"calificacion" >= 1 AND "calificacion" <= 5')
export class Calificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sesion_id: number;

  @Column()
  estudiante_id: number;

  @Column()
  tutor_id: number;

  @Column({ type: 'int' })
  calificacion: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn()
  fecha: Date;

  @ManyToOne(() => Sesion, sesion => sesion.calificaciones)
  @JoinColumn({ name: 'sesion_id' })
  sesion: Sesion;

  @ManyToOne(() => Estudiante, estudiante => estudiante.calificaciones)
  @JoinColumn({ name: 'estudiante_id' })
  estudiante: Estudiante;

  @ManyToOne(() => Tutor, tutor => tutor.calificaciones)
  @JoinColumn({ name: 'tutor_id' })
  tutor: Tutor;
}