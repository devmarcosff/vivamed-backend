import { plainToClass } from "class-transformer";
import { VivamedBigBaseEntity } from "src/shared/entities/vivamed-full-base-entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Firm } from "../../firm/entities/firm.entity";
import { ProfileV2 } from "../../profile/entities/profile-v2.entity";
import { AddressV2Dto } from "../dto/address-v2.dto";

@Entity('addresses_v2')
export class AddressV2 extends VivamedBigBaseEntity {
    @Column()
    zipcode: string;

    @Column()
    street: string;

    @Column()
    number: number;

    @Column()
    neighborhood: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @Column({ nullable: true })
    complement: string;

    @OneToOne(() => ProfileV2, profile => profile.address)
    @JoinColumn()
    profile: ProfileV2;

    @OneToOne(() => Firm, firm => firm.address)
    @JoinColumn()
    firm: Firm;

    public toDto(): AddressV2Dto {
        return plainToClass(AddressV2Dto, {
            id: this.id,
            zipcode: this.zipcode,
            street: this.street,
            number: this.number,
            neighborhood: this.neighborhood,
            city: this.city,
            state: this.state,
            complement: this.complement,
            latitude: this.latitude,
            longitude: this.longitude,
            profileId: this.profile?.id ?? "",
            firmId: this.firm?.id ?? "",
        } as AddressV2Dto);
    }
}