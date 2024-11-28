import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProductV2Dto {
    @ApiProperty({ description: 'Photo of the product', example: 'https://example.com/photo.jpg' })
    @IsNotEmpty()
    @IsString()
    photo: string;

    @ApiProperty({ description: 'Unique code of the product', example: 'PRD12345' })
    @IsNotEmpty()
    @IsString()
    code: string;

    @ApiProperty({ description: 'Name of the product', example: 'Paracetamol' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Active ingredient of the product', example: 'Paracetamol' })
    @IsNotEmpty()
    @IsString()
    activeIngredient: string;

    @ApiProperty({ description: 'Pharmaceutical form of the product', example: 'Tablet' })
    @IsNotEmpty()
    @IsString()
    pharmaceuticalForm: string;

    @ApiProperty({ description: 'Concentration of the product', example: '500mg' })
    @IsNotEmpty()
    @IsString()
    concentration: string;

    @ApiProperty({ description: 'Health registration of the product', example: '123456789' })
    @IsNotEmpty()
    @IsString()
    healthRegistration: string;

    @ApiProperty({ description: 'Manufacturer of the product', example: 'PharmaCorp' })
    @IsNotEmpty()
    @IsString()
    manufacturer: string;

    @ApiProperty({ description: 'Leaflet URL for the product', example: 'https://example.com/leaflet.pdf', required: false })
    @IsOptional()
    @IsUrl()
    leafletURL?: string;
}
