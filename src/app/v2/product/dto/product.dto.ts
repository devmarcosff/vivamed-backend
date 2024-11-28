import { ApiProperty } from '@nestjs/swagger';

export class ProductV2Dto {
    @ApiProperty({ description: 'ID of the product', example: 'uuid' })
    id: string;

    @ApiProperty({ description: 'Photo of the product', example: 'https://example.com/photo.jpg' })
    photo: string;

    @ApiProperty({ description: 'Unique code of the product', example: 'PRD12345' })
    code: string;

    @ApiProperty({ description: 'Name of the product', example: 'Paracetamol' })
    name: string;

    @ApiProperty({ description: 'Active ingredient of the product', example: 'Paracetamol' })
    activeIngredient: string;

    @ApiProperty({ description: 'Pharmaceutical form of the product', example: 'Tablet' })
    pharmaceuticalForm: string;

    @ApiProperty({ description: 'Concentration of the product', example: '500mg' })
    concentration: string;

    @ApiProperty({ description: 'Health registration of the product', example: '123456789' })
    healthRegistration: string;

    @ApiProperty({ description: 'Manufacturer of the product', example: 'PharmaCorp' })
    manufacturer: string;

    @ApiProperty({ description: 'Leaflet URL for the product', example: 'https://example.com/leaflet.pdf', required: false })
    leafletURL?: string;
}
