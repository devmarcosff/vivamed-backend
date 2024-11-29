import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class ReceiptProductDto {
    @ApiProperty({ description: 'Product code', example: '123456' })
    @IsString()
    @IsNotEmpty()
    productCode: string;

    @ApiProperty({ description: 'Product batch', example: 'L123456' })
    @IsString()
    @IsNotEmpty()
    productBatch: string;

    @ApiProperty({ description: 'Batch expiration date', example: '2024-11-28' })
    @IsDateString()
    @IsNotEmpty()
    productExpirationDate: Date;

    @ApiProperty({ description: 'Batch manufacturing date', example: '2024-01-15' })
    @IsDateString()
    @IsNotEmpty()
    productManufacturingDate: Date;

    @ApiProperty({ description: 'Quantity of the product', example: 50 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'Unit value of the product', example: 1.50 })
    @IsNumber()
    @IsNotEmpty()
    unitPrice: number;

    @ApiProperty({ description: 'NCM code', example: '30049099' })
    @IsString()
    @IsNotEmpty()
    ncmCode: string;

    @ApiProperty({ description: 'CST code', example: '101' })
    @IsString()
    @IsNotEmpty()
    cst: string;

    @ApiProperty({ description: 'CFOP code', example: '5102' })
    @IsString()
    @IsNotEmpty()
    cfopCode: string;

    @ApiProperty({ description: 'Unit of measure', example: 'unit' })
    @IsString()
    @IsNotEmpty()
    unitOfMeasure: string;

    @ApiProperty({ description: 'ICMS calculation base', example: 100.00 })
    @IsNumber()
    @IsOptional()
    bcIcms?: number;

    @ApiProperty({ description: 'ICMS value', example: 18.00 })
    @IsNumber()
    @IsOptional()
    vIcms?: number;

    @ApiProperty({ description: 'IPI value', example: 5.00 })
    @IsNumber()
    @IsOptional()
    vIpi?: number;

    @ApiProperty({ description: 'ICMS rate percentage', example: 18.00 })
    @IsNumber()
    @IsOptional()
    aIcms?: number;

    @ApiProperty({ description: 'IPI rate percentage', example: 10.00 })
    @IsNumber()
    @IsOptional()
    aIpi?: number;
}