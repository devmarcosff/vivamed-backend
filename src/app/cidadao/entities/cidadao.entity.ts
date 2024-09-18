import { Address } from "src/app/address/entities/address.entity";
import { Consulta } from "src/app/consulta/entities/consulta.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Cidadao {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    prontuario: string;

    @Column()
    name: string;

    @Column()
    cpf: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    birthday: Date;

    @Column({ type: 'boolean', default: false })
    caps: boolean;

    @Column()
    password: string;

    @OneToOne(() => Address, (address) => address.cidadao)
    address: Address;

    @OneToMany(() => Consulta, consulta => consulta.cidadao)
    consultas: Consulta[];
}