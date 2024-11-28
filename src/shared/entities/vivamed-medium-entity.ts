import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VivamedSmallBaseEntity } from './vivamed-small-base-entity';

export abstract class VivamedMediumBaseEntity extends VivamedSmallBaseEntity {
    @Column({ default: true })
    enabled: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

}