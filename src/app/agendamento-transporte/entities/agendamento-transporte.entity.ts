import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AgendamentoTransporte {
    @PrimaryGeneratedColumn('uuid')
    id?: any;

    @Column()
    createAt?: Date;

    @Column()
    dataAgendada?: Date

    @Column()
    horaAgendada?: string

    @Column()
    nomePaciente?: string

    @Column()
    cpfPaciente?: string

    @Column()
    dataNascimento?: Date;

    @Column()
    nomeMotorista?: string
}
