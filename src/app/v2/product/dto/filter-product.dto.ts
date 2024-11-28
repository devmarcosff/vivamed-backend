import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';

export class ProductV2FilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ description: 'Unique code of the product', example: 'PRD12345' })
    @IsString()
    code: string;

    @ApiPropertyOptional({ description: 'Name of the product', example: 'Paracetamol' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Active ingredient of the product', example: 'Paracetamol' })
    @IsString()
    activeIngredient: string;

    @ApiPropertyOptional({ description: 'Concentration of the product', example: '500mg' })
    @IsString()
    concentration: string;

    @ApiPropertyOptional({ description: 'Health registration of the product', example: '123456789' })
    @IsString()
    healthRegistration: string;

    @ApiPropertyOptional({ description: 'Manufacturer of the product', example: 'PharmaCorp' })
    @IsString()
    manufacturer: string;
}
