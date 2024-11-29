import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateReceiptDto } from './create-receipt.dto';

export class UpdateReceiptDto extends PartialType(CreateReceiptDto) {
    @ApiPropertyOptional({ description: 'Invoice number of the receipt', example: '123456', maxLength: 50, })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    invoiceNumber: string;

    @ApiPropertyOptional({ description: 'Invoice series of the receipt', example: 'A1', maxLength: 20, })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    invoiceSeries: string;

    @ApiPropertyOptional({ description: 'The date and time when the invoice was issued', example: '2024-11-27T12:00:00', })
    @IsOptional()
    @IsDateString()
    issueDateTime: Date;

    @ApiPropertyOptional({ description: 'CNPJ of the firm issuing the receipt', example: '12345678000195', })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    issuerCnpj: string;

    @ApiPropertyOptional({ description: 'CNPJ of the recipient firm', example: '98765432000176', })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    recipientCnpj: string;

    @ApiPropertyOptional({ description: 'Total value of the receipt', example: 1500.50, })
    @IsOptional()
    @IsNumber()
    totalValue: number;

    @ApiPropertyOptional({ description: 'ICMS base calculation value', example: 1000.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    icmsBase?: number;

    @ApiPropertyOptional({ description: 'ICMS value', example: 150.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    icmsValue?: number;

    @ApiPropertyOptional({ description: 'IPI value', example: 50.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    ipiValue?: number;

    @ApiPropertyOptional({ description: 'ISS value', example: 100.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    issValue?: number;

    @ApiPropertyOptional({ description: 'ICMS rate percentage', example: 18.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    icmsRate?: number;

    @ApiPropertyOptional({ description: 'IPI rate percentage', example: 10.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    ipiRate?: number;

    @ApiPropertyOptional({ description: 'ISS rate percentage', example: 5.00, required: false, })
    @IsOptional()
    @IsOptional()
    @IsNumber()
    issRate?: number;

    @ApiPropertyOptional({ description: 'Barcode or authorization code for the invoice', example: '12345678901234567890', required: false, })
    @IsOptional()
    @IsOptional()
    @IsString()
    barcodeOrAuthCode?: string;

    @ApiPropertyOptional({ description: 'Access key for NFe (Nota Fiscal Eletrônica)', example: '351904123456789012345500100100001234567890123', required: false, })
    @IsOptional()
    @IsOptional()
    @IsString()
    nfeAccessKey?: string;
}
