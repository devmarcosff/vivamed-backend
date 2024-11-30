import { ApiProperty } from "@nestjs/swagger";

export class ReceiptProductDto {
    @ApiProperty({ description: 'Product code', example: '123456' })
    productCode: string;

    @ApiProperty({ description: 'Product batch', example: 'L123456' })
    productBatch: string;

    @ApiProperty({ description: 'Batch expiration date', example: '2024-11-28' })
    productExpirationDate: Date;

    @ApiProperty({ description: 'Batch manufacturing date', example: '2024-01-15' })
    productManufacturingDate: Date;

    @ApiProperty({ description: 'Quantity of the product', example: 50 })
    quantity: number;

    @ApiProperty({ description: 'Unit value of the product', example: 1.50 })
    unitPrice: number;

    @ApiProperty({ description: 'NCM code', example: '30049099' })
    ncmCode: string;

    @ApiProperty({ description: 'CST code', example: '101' })
    cst: string;

    @ApiProperty({ description: 'CFOP code', example: '5102' })
    cfopCode: string;

    @ApiProperty({ description: 'Unit of measure', example: 'unit' })
    unitOfMeasure: string;

    @ApiProperty({ description: 'ICMS calculation base', example: 100.00 })
    bcIcms?: number;

    @ApiProperty({ description: 'ICMS value', example: 18.00 })
    vIcms?: number;

    @ApiProperty({ description: 'IPI value', example: 5.00 })
    vIpi?: number;

    @ApiProperty({ description: 'ICMS rate percentage', example: 18.00 })
    aIcms?: number;

    @ApiProperty({ description: 'IPI rate percentage', example: 10.00 })
    aIpi?: number;
}