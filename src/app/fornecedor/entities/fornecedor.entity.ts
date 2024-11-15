import { Address } from "src/app/address/entities/address.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('fornecedor')
export class Fornecedor {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column({ nullable: true })
    createAt: Date;
    @Column({ nullable: true, default: false })
    softDelete?: boolean;
    @Column()
    nome: string;
    @Column()
    email?: string;
    @Column()
    contato?: string;
    @Column()
    cnpj: string;
    @OneToOne(() => Address, (address) => address.userId)
    address: Address;
}
