import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDecimal, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateStockProductDto {
    @ApiProperty({ description: 'Product ID associated with this stock entry', required: false })
    @IsOptional()
    @IsUUID()
    productId?: string;

    @ApiProperty({ description: 'Batch number of the product', required: false })
    @IsOptional()
    @IsString()
    batch?: string;

    @ApiProperty({ description: 'Expiration date of the batch', required: false, type: Date })
    @IsOptional()
    @IsDate()
    expirationDate?: Date;

    @ApiProperty({ description: 'Manufacture date of the batch', required: false, type: Date })
    @IsOptional()
    @IsDate()
    manufactureDate?: Date;

    @ApiProperty({ description: 'Quantity of the batch in stock', required: false })
    @IsOptional()
    @IsInt()
    quantity?: number;

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
