import { VivamedFullBaseEntity } from 'src/shared/entities/vivamed-full-base-entity';
import { Column, Entity } from 'typeorm';

@Entity('citizens_v2')
export class Citizen extends VivamedFullBaseEntity {
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
}
