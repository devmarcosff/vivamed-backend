import { ApiProperty } from '@nestjs/swagger';
import { StockProductV2Dto } from '../../product/dto/stock-product.dto';

export class StockMovementDto {
    @ApiProperty({ description: 'ID da movimentação', example: 'uuid' })
    id: string;

    @ApiProperty({ description: 'Tipo da movimentação', example: 'IN' })
    type: 'IN' | 'OUT' | 'ADJUSTMENT';

    @ApiProperty({ description: 'Quantidade movimentada', example: 10.5 })
    quantity: number;

    @ApiProperty({ description: 'Descrição da movimentação', example: 'Ajuste de inventário' })
    description?: string;

    @ApiProperty({ description: 'Data da criação', example: '2024-11-28T14:30:00Z' })
    createdAt: Date;

    @ApiProperty({ description: 'Detalhes do estoque associado', type: StockProductV2Dto })
    stockProduct: StockProductV2Dto;
}
