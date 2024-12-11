import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductV2Dto } from '../../product/dto/product.dto';
import { ReceiptProductDto } from '../../receipt/dto/receipt-product.dto';
import { StockMovementDto } from '../../stock-movment/dto/stock-movment.dto';

export class StockProductV2Dto {
    @ApiProperty({ description: 'Product batch', example: 'L12345' })
    batch: string;

    @ApiProperty({ description: 'Product expiration date', example: '2024-12-31' })
    expirationDate: Date;

    @ApiProperty({ description: 'Product manufacture date', example: '2023-01-01' })
    manufactureDate: Date;

    @ApiProperty({ description: 'Quantity in stock', example: 100 })
    quantity: number;

    @ApiPropertyOptional({ description: 'Unit price of the product', example: 15.5 })
    unitPrice?: number;

    @ApiPropertyOptional({ description: 'Sale price of the product', example: 18.0 })
    salePrice?: number;

    @ApiPropertyOptional({ description: 'Product location in stock', example: 'A1-B2-C3' })
    location?: string;

    @ApiProperty({ description: 'Details of the associated product', type: () => ProductV2Dto })
    product: ProductV2Dto;

    @ApiProperty({
        description: 'List of products associated with the receipt',
        type: () => [ReceiptProductDto],
    })
    receiptProducts: ReceiptProductDto[];

    @ApiProperty({
        description: 'List of stock movements related to the product',
        type: () => [StockMovementDto],
    })
    movements: StockMovementDto[];
}
