import { ApiProperty } from '@nestjs/swagger';
import { StockProductV2Dto } from '../../product/dto/stock-product.dto';

export class StockMovementDto {
    @ApiProperty({ description: 'Movement ID', example: 'uuid' })
    id: string;

    @ApiProperty({ description: 'Movement type', example: 'IN' })
    type: 'IN' | 'OUT' | 'ADJUSTMENT';

    @ApiProperty({ description: 'Quantity moved', example: 10.5 })
    quantity: number;

    @ApiProperty({ description: 'Movement description', example: 'Inventory adjustment' })
    description?: string;

    @ApiProperty({ description: 'Creation date', example: '2024-11-28T14:30:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Associated stock details', type: StockProductV2Dto })
    stockProduct: StockProductV2Dto;
}
