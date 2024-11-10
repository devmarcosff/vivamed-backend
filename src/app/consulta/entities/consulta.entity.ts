import { Cidadao } from "src/app/cidadao/entities/cidadao.entity";
import { Medicamento } from "src/app/medicamentos/entities/medicamento.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Consulta {
    @PrimaryGeneratedColumn('uuid')
    id: any;

    @Column()
    respTec?: string;

    @Column({ nullable: true })
    idRespTec: string;

    @Column()
    role: string;

    @Column()
    prontuario: string;

    @Column()
    paciente: string;

    @Column()
    createAt: Date;

    @Column()
    descricao: string;

    @ManyToOne(() => Cidadao, cidadao => cidadao.consultas)
    cidadao: Cidadao;

    @OneToMany(() => Medicamento, medicamentos => medicamentos.consultas)
    medicamentos: Medicamento[];
}
