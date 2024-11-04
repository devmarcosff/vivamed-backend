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

    @ManyToOne(() => Cidadao, cidadao => cidadao.agendaConsultas)
    cidadao: Cidadao;
}
