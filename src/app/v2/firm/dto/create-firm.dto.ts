import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFirmDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    businessName: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    tradeName?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    cnpj: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    stateRegistration?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    municipalRegistration?: string;
}
