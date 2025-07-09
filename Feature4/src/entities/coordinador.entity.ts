import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('coordinador')
export class Coordinador {
  @PrimaryColumn()
  id: number;

  @Column({ length: 20, unique: true })
  cedula: string;

  @Column({ length: 100, nullable: true })
  departamento: string;

  @Column({ length: 20, nullable: true })
  extension_interna: string;

  @OneToOne(() => Usuario, usuario => usuario.coordinador)
  @JoinColumn({ name: 'id' })
  usuario: Usuario;
}