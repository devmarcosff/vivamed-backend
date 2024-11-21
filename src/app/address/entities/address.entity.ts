import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Fornecedor } from '../../fornecedor/entities/fornecedor.entity';

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    cep: string;

    @Column()
    num: string;

    @Column()
    state: string;

    // @ManyToOne(() => User, user => user.address, { eager: true })
    // userId: User; // Referência ao usuário

    // @OneToOne(() => User, (user) => user.address, { nullable: true })
    // @JoinColumn()
    // userId?: User;

    @OneToOne(() => Fornecedor, (fornecedor) => fornecedor.address, { nullable: true })
    @JoinColumn()
    userId?: Fornecedor;

    // @OneToOne(() => Cidadao, (cidadao) => cidadao.address)
    // @JoinColumn()
    // cidadao: Cidadao;
} 