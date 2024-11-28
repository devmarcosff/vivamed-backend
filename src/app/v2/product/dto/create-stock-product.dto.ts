import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDecimal, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStockProductDto {
    @ApiProperty({ description: 'Product ID associated with this stock entry' })
    @IsUUID()
    productId: string;

    @ApiProperty({ description: 'Batch number of the product' })
    @IsString()
    batch: string;

    @ApiProperty({ description: 'Expiration date of the batch', type: Date })
    @IsDate()
    expirationDate: Date;

    @ApiProperty({ description: 'Manufacture date of the batch', type: Date })
    @IsDate()
    manufactureDate: Date;

    @ApiProperty({ description: 'Quantity of the batch in stock' })
    @IsInt()
    quantity: number;

    @ApiProperty({ description: 'Unit purchase price', required: false })
    @IsOptional()
    @IsDecimal()
    purchasePrice?: number;

    @ApiProperty({ description: 'Unit sale price', required: false })
    @IsOptional()
    @IsDecimal()
    salePrice?: number;

    @ApiProperty({ description: 'Stock location', required: false })
    @IsOptional()
    @IsString()
    location?: string;
}
