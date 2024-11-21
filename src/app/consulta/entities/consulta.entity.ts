import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Cidadao } from "../../cidadao/entities/cidadao.entity";
import { Medicamento } from "../../medicamentos/entities/medicamento.entity";

@Entity()
export class Consulta {
    @PrimaryGeneratedColumn('uuid')
    id: any;

    @Column()
    respTec?: string;

    @Column({ nullable: true })
    idRespTec?: string;

    @Column()
    role?: string;

    @Column()
    prontuario?: string;

    @Column()
    paciente?: string;

    @Column()
    createAt?: Date;

    @Column()
    descricao?: string;

    @Column()
    idConsulta?: string;

    @ManyToOne(() => Cidadao, cidadao => cidadao.consultas)
    cidadao: Cidadao;

    @OneToMany(() => Medicamento, medicamentos => medicamentos.consultas)
    medicamentos?: Medicamento[];
}
