import { Cidadao } from "src/app/cidadao/entities/cidadao.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AgendarConsulta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    createAt?: Date;

    @Column()
    dataconsulta?: Date;

    @Column('time')
    horaconsulta?: string;

    @Column()
    recorrente?: boolean;

    @Column()
    prontuario?: string;

    @Column({ nullable: true })
    paciente?: string;

    @Column({ nullable: true })
    tecResponsavel?: string;

    @Column({ nullable: true })
    status?: string;

    @Column({ nullable: true })
    idTecResponsavel?: string;

    @ManyToOne(() => Cidadao, cidadao => cidadao.agendaConsultas)
    cidadao: Cidadao;
}
