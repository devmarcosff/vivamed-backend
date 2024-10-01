import { Order } from "src/app/order/entities/order.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Address } from '../../address/entities/address.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    cpf: string;

    @Column()
    idProf: string;

    @Column()
    role: string;

    @Column()
    active: Date;

    @Column()
    birthday: Date;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToOne(() => Address, (address) => address.user)
    address: Address;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}
