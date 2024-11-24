import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class VivamedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: true })
    enabled: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'created_by', nullable: true })
    createdBy: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'updated_by', nullable: true })
    updatedBy: string;
}