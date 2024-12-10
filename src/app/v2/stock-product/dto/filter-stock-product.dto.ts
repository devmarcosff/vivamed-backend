import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';

export class StockProductFilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ description: 'Product batch', example: 'L12345' })
    batch: string;

    @ApiPropertyOptional({ description: 'Product location in stock', example: 'A1-B2-C3' })
    location?: string;

    @ApiPropertyOptional({ description: 'Product ID', example: "" })
    productId?: string;

    @ApiPropertyOptional({ description: 'Product name', example: "Dipirona" })
    productName?: string;
}
