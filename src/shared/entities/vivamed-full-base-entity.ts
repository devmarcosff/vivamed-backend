import { Column } from 'typeorm';
import { VivamedMediumBaseEntity } from './vivamed-medium-entity';

export abstract class VivamedBigBaseEntity extends VivamedMediumBaseEntity {
    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy: string;
}