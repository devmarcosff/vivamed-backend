import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class AddressV2Dto {
    @ApiProperty({ description: 'Unique identifier of the address', example: 'addr1234' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Postal code', example: '12345-678' })
    @IsString()
    zipcode: string;

    @ApiProperty({ description: 'Street name', example: 'Av. Paulista' })
    @IsString()
    street: string;

    @ApiProperty({ description: 'Building or house number', example: 1234 })
    @IsNumber()
    number: number;

    @ApiProperty({ description: 'Neighborhood or district', example: 'Bela Vista' })
    @IsString()
    neighborhood: string;

    @ApiProperty({ description: 'City name', example: 'São Paulo' })
    @IsString()
    city: string;

    @ApiProperty({ description: 'State abbreviation', example: 'SP' })
    @IsString()
    state: string;

    @ApiProperty({ description: 'Latitude coordinate', example: -23.5505 })
    @IsNumber()
    latitude: number;

    @ApiProperty({ description: 'Longitude coordinate', example: -46.6333 })
    @IsNumber()
    longitude: number;

    @ApiProperty({ description: 'Additional address details', example: 'Apartment 101' })
    @IsString()
    complement: string;

    @ApiPropertyOptional({ description: 'Associated citizen ID', example: 'cit1234' })
    @IsOptional()
    @IsString()
    citizenId?: string;

    @ApiPropertyOptional({ description: 'Associated profile ID', example: 'prof5678' })
    @IsOptional()
    @IsString()
    profileId?: string;

    @ApiPropertyOptional({ description: 'Associated firm ID', example: 'firm9012' })
    @IsOptional()
    @IsString()
    firmId?: string;
}
