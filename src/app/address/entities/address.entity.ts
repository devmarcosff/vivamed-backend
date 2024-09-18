import { Cidadao } from "src/app/cidadao/entities/cidadao.entity";
import { User } from "src/app/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    cep: number;

    @Column()
    state: string;

    @OneToOne(() => User, (user) => user.address)
    @JoinColumn()
    user: User;

    @OneToOne(() => Cidadao, (cidadao) => cidadao.address)
    @JoinColumn()
    cidadao: Cidadao;
} 