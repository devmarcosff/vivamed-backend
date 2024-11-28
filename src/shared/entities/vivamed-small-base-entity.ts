import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class VivamedSmallBaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
}