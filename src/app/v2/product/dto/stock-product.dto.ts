import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReceiptProductDto } from '../../receipt/dto/receipt-product.dto';
import { StockMovementDto } from '../../stock-movment/dto/stock-movment.dto';
import { ProductV2Dto } from './product.dto';

export class StockProductV2Dto {
    @ApiProperty({ description: 'Lote do produto', example: 'L12345' })
    batch: string;

    @ApiProperty({ description: 'Data de validade do produto', example: '2024-12-31' })
    expirationDate: Date;

    @ApiProperty({ description: 'Data de fabricação do produto', example: '2023-01-01' })
    manufactureDate: Date;

    @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
    quantity: number;

    @ApiPropertyOptional({ description: 'Preço unitário do produto', example: 15.5 })
    unitPrice?: number;

    @ApiPropertyOptional({ description: 'Preço de venda do produto', example: 18.0 })
    salePrice?: number;

    @ApiPropertyOptional({ description: 'Localização do produto no estoque', example: 'A1-B2-C3' })
    location?: string;

    @ApiProperty({ description: 'Detalhes do produto associado', type: ProductV2Dto })
    product: ProductV2Dto;

    @ApiProperty({
        description: 'Lista de produtos associados ao recebimento',
        type: [ReceiptProductDto],
    })
    receiptProducts: ReceiptProductDto[];

    @ApiProperty({
        description: 'Lista de movimentações de estoque relacionadas',
        type: [StockMovementDto],
    })
    movements: StockMovementDto[];
}
