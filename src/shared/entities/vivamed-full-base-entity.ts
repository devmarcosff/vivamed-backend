import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { VivamedBaseEntity } from './vivamed-base-entity';

export abstract class VivamedFullBaseEntity extends VivamedBaseEntity {
    @Column({ default: true })
    enabled: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy: string;
}