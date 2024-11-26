// src/citizen/dto/create-citizen.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateCitizenDto {
    @ApiProperty({ description: 'Full name of the citizen' })
    fullName: string;

    @ApiProperty({ description: 'Citizen Identification Number (CPF)', uniqueItems: true })
    cpf: string;

    @ApiProperty({ description: 'National Health Card (CNS)', required: false })
    cns?: string;

    @ApiProperty({ description: 'Date of birth' })
    birthDate: Date;

    @ApiProperty({ description: 'Gender of the citizen' })
    gender: string;

    @ApiProperty({ description: 'Age of the citizen' })
    age: number;

    @ApiProperty({ description: 'Weighting factor' })
    weighting: number;

    @ApiProperty({ description: 'Identification type' })
    identificationType: string;

    @ApiProperty({ description: 'Most recent date of contact or service' })
    lastContactDate: Date;

    @ApiProperty({ description: 'Number of services or consultations' })
    totalServices: number;

    @ApiProperty({ description: 'City of residence' })
    city: string;

    @ApiProperty({ description: 'District of residence' })
    district: string;
}
