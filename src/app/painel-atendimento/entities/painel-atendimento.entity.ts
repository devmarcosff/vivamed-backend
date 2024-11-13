
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PainelAtendimento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  senha?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @Column({ nullable: true })
  sala?: string;

  @Column({ nullable: true })
  inicioAtendimento?: Date;

  @Column({ nullable: true })
  finalAtendimento?: Date;
}
