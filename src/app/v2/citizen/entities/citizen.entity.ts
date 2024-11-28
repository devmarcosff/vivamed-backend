import { plainToClass } from 'class-transformer';
import { VivamedBigBaseEntity } from 'src/shared/entities/vivamed-full-base-entity';
import { Column, Entity } from 'typeorm';
import { CitizenDto } from '../dto/citizen.dto';

@Entity('citizens_v2')
export class Citizen extends VivamedBigBaseEntity {
    @Column()
    fullName: string;

    @Column({ nullable: true })
    cpf: string;

    @Column({ unique: true })
    cns: string;

    @Column({ nullable: true, type: 'date' })
    birthDate: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true })
    weighting: string;

    @Column({ nullable: true })
    identificationType: string;

    @Column({ nullable: true, type: 'date' })
    lastContactDate: Date;

    @Column({ nullable: true })
    totalServices: number;

    @Column()
    city: string;

    @Column()
    district: string;

    public toDto(): CitizenDto {
        return plainToClass(CitizenDto, {
            fullName: this.fullName,
            cpf: this.cpf,
            cns: this.cns,
            birthDate: this.birthDate,
            gender: this.gender,
            age: this.age,
            weighting: this.weighting,
            identificationType: this.identificationType,
            lastContactDate: this.lastContactDate,
            totalServices: this.totalServices,
            city: this.city,
            district: this.district,
        });
    }
}
