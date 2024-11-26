import { plainToClass } from "class-transformer";
import { VivamedFullBaseEntity } from "src/shared/entities/vivamed-full-base-entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { ProfileV2 } from "../../profile/entities/profile-v2.entity";
import { AddressV2Dto } from "../dto/address-v2.dto";

@Entity('addresses_v2')
export class AddressV2 extends VivamedFullBaseEntity {
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

    // @OneToOne(() => Cidadao, (cidadao) => cidadao.address)
    // @JoinColumn()
    // citizen: Cidadao;

    @OneToOne(() => ProfileV2, profile => profile.address)
    @JoinColumn()
    profile: ProfileV2;

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
            // citizenId: this.citizen ? this.citizen.id : "",
            profileId: this.profile?.id ?? "",
        } as AddressV2Dto);
    }
}