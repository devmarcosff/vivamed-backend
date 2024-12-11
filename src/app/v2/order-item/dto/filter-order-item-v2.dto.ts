import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationParamsDto } from "src/shared/dto/pagination-params.dto";

export class OrderItemV2FilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ description: 'Filter by order ID', example: 'uuid' })
    @IsOptional()
    @IsString()
    orderId?: string;

    @ApiPropertyOptional({ description: 'Filter by stock product ID', example: 'uuid' })
    @IsOptional()
    @IsString()
    stockProductId?: string;

    @ApiPropertyOptional({ description: 'Filter by product name', example: 'Dipirona' })
    @IsOptional()
    @IsString()
    productName?: string;
}