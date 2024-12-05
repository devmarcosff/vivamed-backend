import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';

export class StockMovementFilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ description: 'Product name', example: 'Paracetamol' })
    @IsString()
    @IsOptional()
    productName?: string;

    @ApiPropertyOptional({ description: 'Movement type', example: 'IN' })
    @IsEnum(['IN', 'OUT', 'ADJUSTMENT'])
    @IsOptional()
    type?: 'IN' | 'OUT' | 'ADJUSTMENT';
}
