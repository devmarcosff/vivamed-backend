import { plainToClass } from "class-transformer";
import { VivamedFullBaseEntity } from "src/shared/entities/vivamed-full-base-entity";
import { Role } from "src/shared/enuns/role.enum";
import { Column, Entity, OneToOne } from "typeorm";
import { ProfileV2 } from "../../profile/entities/profile-v2.entity";
import { UserV2Dto } from "../dto/user-v2.dto";

@Entity('users_v2')
export class UserV2 extends VivamedFullBaseEntity {
    @Column({ unique: true })
    cpf: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @Column({ nullable: true })
    accessToken: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ nullable: true })
    codeResetPassword: string;

    @Column({ nullable: true })
    codeResetPasswordExpiration: Date;

    @OneToOne(() => ProfileV2, profile => profile.user, { cascade: true })
    profile: ProfileV2;

    public toDto(): UserV2Dto {
        return plainToClass(UserV2Dto, {
            id: this.id,
            email: this.email,
            cpf: this.cpf,
            profile: this.profile?.toDto() ?? undefined
        });
    }
}