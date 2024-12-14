import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";
import { AddressV2Dto } from "../../address/dto/address-v2.dto";

export class FirmDto {
    @ApiProperty({ description: 'Unique identifier of the firm', example: 'f1234567' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Official business name', example: 'Acme Corporation Ltd.' })
    @IsString()
    businessName: string;

    @ApiPropertyOptional({ description: 'Fantasy name or trade name', example: 'Acme Inc.' })
    @IsOptional()
    @IsString()
    fantasyName?: string;

    @ApiProperty({ description: 'Company tax identification number (CNPJ)', example: '12.345.678/0001-90' })
    @IsString()
    cnpj: string;

    @ApiPropertyOptional({ description: 'Contact phone number', example: '+55 (11) 1234-5678' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: 'Company email address', example: 'contact@acme.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'State registration number', example: '123456789' })
    @IsOptional()
    @IsString()
    stateRegistration?: string;

    @ApiPropertyOptional({ description: 'Municipal registration number', example: '987654321' })
    @IsOptional()
    @IsString()
    municipalRegistration?: string;

    @ApiPropertyOptional({
        description: 'Address',
        type: () => AddressV2Dto,
    })
    address?: AddressV2Dto;
}