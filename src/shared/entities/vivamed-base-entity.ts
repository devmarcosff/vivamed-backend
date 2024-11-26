import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class VivamedBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}