import { plainToClass } from "class-transformer";
import { VivamedBigBaseEntity } from "src/shared/entities/vivamed-full-base-entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AddressV2 } from "../../address/entities/address-v2.entity";
import { UserV2 } from "../../user/entities/user-v2.entity";
import { ProfileV2Dto } from "../dto/profile-v2.dto";

@Entity('profiles_v2')
export class ProfileV2 extends VivamedBigBaseEntity {
    @Column()
    name: string;

    @Column({ nullable: true })
    birthday?: Date;

    @Column({ nullable: true })
    picture?: string;

    @OneToOne(() => UserV2, user => user.profile, { cascade: false })
    @JoinColumn()
    user: UserV2;

    @OneToOne(() => AddressV2, address => address.profile, { cascade: false })
    address: AddressV2;

    public toDto(): ProfileV2Dto {
        return plainToClass(ProfileV2Dto, {
            id: this.id,
            name: this.name,
            birthday: this.birthday ?? undefined,
            picture: this.picture,
            user: this.user?.toDto() ?? undefined,
            address: this.address?.toDto() ?? undefined,
        });
    }
}