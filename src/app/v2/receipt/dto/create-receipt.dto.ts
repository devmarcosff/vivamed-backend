import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiptDto {
    @ApiProperty({ description: 'Invoice number of the receipt', example: '123456', maxLength: 50, })
    @IsString()
    @IsNotEmpty()
    invoiceNumber: string;

    @ApiProperty({ description: 'Invoice series of the receipt', example: 'A1', maxLength: 20, })
    @IsString()
    @IsNotEmpty()
    invoiceSeries: string;

    @ApiProperty({ description: 'The date and time when the invoice was issued', example: '2024-11-27T12:00:00', })
    @IsDateString()
    issueDateTime: Date;

    @ApiProperty({ description: 'CNPJ of the firm issuing the receipt', example: '12345678000195', })
    @IsString()
    @IsNotEmpty()
    issuerCnpj: string;

    @ApiProperty({ description: 'CNPJ of the recipient firm', example: '98765432000176', })
    @IsString()
    @IsNotEmpty()
    recipientCnpj: string;

    @ApiProperty({ description: 'Total value of the receipt', example: 1500.50, })
    @IsNumber()
    totalValue: number;

    @ApiProperty({ description: 'ICMS base calculation value', example: 1000.00, required: false, })
    @IsOptional()
    @IsNumber()
    icmsBase?: number;

    @ApiProperty({ description: 'ICMS value', example: 150.00, required: false, })
    @IsOptional()
    @IsNumber()
    icmsValue?: number;

    @ApiProperty({ description: 'IPI value', example: 50.00, required: false, })
    @IsOptional()
    @IsNumber()
    ipiValue?: number;

    @ApiProperty({ description: 'ISS value', example: 100.00, required: false, })
    @IsOptional()
    @IsNumber()
    issValue?: number;

    @ApiProperty({ description: 'ICMS rate percentage', example: 18.00, required: false, })
    @IsOptional()
    @IsNumber()
    icmsRate?: number;

    @ApiProperty({ description: 'IPI rate percentage', example: 10.00, required: false, })
    @IsOptional()
    @IsNumber()
    ipiRate?: number;

    @ApiProperty({ description: 'ISS rate percentage', example: 5.00, required: false, })
    @IsOptional()
    @IsNumber()
    issRate?: number;

    @ApiProperty({ description: 'Barcode or authorization code for the invoice', example: '12345678901234567890', required: false, })
    @IsOptional()
    @IsString()
    barcodeOrAuthCode?: string;

    @ApiProperty({ description: 'Access key for NFe (Nota Fiscal Eletrônica)', example: '351904123456789012345500100100001234567890123', required: false, })
    @IsOptional()
    @IsString()
    nfeAccessKey?: string;
}
