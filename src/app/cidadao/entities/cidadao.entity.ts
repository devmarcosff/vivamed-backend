import { AgendarConsulta } from "src/app/agendar-consulta/entities/agendar-consulta.entity";
import { Consulta } from "src/app/consulta/entities/consulta.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cidadao {
    @PrimaryGeneratedColumn('uuid')
    id: any;

    @Column()
    createAt: Date;

    @Column()
    nome: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    nascimento: Date;

    @Column({ nullable: true })
    mae: string;

    @Column()
    prontuario: string;

    @Column()
    cpf: string;

    @Column()
    inicioTratamento: string;

    @Column()
    escolaridade: string;

    @Column()
    pai: string;

    @Column()
    conjuge: string;

    @Column()
    cns: string;

    @Column()
    telContato: string;

    @Column()
    cor: string;

    @Column()
    genero: string;

    @Column()
    motivoAcolhimento: string;

    @Column()
    servicoEncaminhado: string;

    @Column()
    drogas: string;

    @Column()
    doenca: string;

    @Column()
    usaMedicacao: string;

    @Column()
    alergiaMedicamento: string;

    @Column()
    cid: string;

    @Column()
    familiaVuneravel: string;

    @Column()
    beneficioSocial: string;

    @Column()
    condutaImediata: string;

    @Column()
    tecResponsavel: string;

    @Column()
    frequencia: string;

    @Column({ type: 'boolean', default: true })
    caps: boolean;

    @Column()
    password: string;

    // @OneToOne(() => Address, (address) => address.cidadao)
    // address: Address;

    @OneToMany(() => Consulta, consulta => consulta.cidadao)
    consultas: Consulta[];

    @OneToMany(() => AgendarConsulta, agendaConsulta => agendaConsulta.cidadao)
    agendaConsultas: AgendarConsulta[];
}