import { plainToClass } from "class-transformer";
import { Cidadao } from "src/app/cidadao/entities/cidadao.entity";
import { User } from "src/app/user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AddressDto } from "../dto/address.dto";

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
    num: number;

    @Column()
    state: string;

    @OneToOne(() => User, (user) => user.address)
    @JoinColumn()
    user: User;

    @OneToOne(() => Cidadao, (cidadao) => cidadao.address)
    @JoinColumn()
    cidadao: Cidadao;

    public toDto(): AddressDto {
        return plainToClass(AddressDto, {
            street: this.street,
            city: this.city,
            cep: this.cep,
            num: this.num,
            state: this.state,
            userId: this.user ? this.user.id : "",
            citizenId: this.cidadao ? this.cidadao.id : ""
        });
    }
} 