import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReceiptDto {
    @ApiProperty({ description: 'Invoice number', example: '12345' })
    @IsString()
    invoiceNumber: string;

    @ApiProperty({ description: 'Invoice series', example: '1' })
    @IsString()
    invoiceSeries: string;

    @ApiProperty({ description: 'Issue date and time', example: '2024-11-26T14:30:00Z' })
    @IsDateString()
    issueDateTime: string;

    @ApiProperty({ description: 'Issuer CNPJ', example: '12345678000195' })
    @IsString()
    issuerCnpj: string;

    @ApiProperty({ description: 'Recipient CNPJ', example: '98765432000123' })
    @IsString()
    recipientCnpj: string;

    @ApiProperty({ description: 'Total invoice value', example: 1500.75 })
    @IsNumber()
    totalValue: number;

    @ApiProperty({
        description: 'Tax information (e.g., ICMS, IPI, ISS)',
        example: { ICMS: 120.5, IPI: 45.3, ISS: 10.0 },
    })
    @IsOptional()
    taxes?: Record<string, number>;

    @ApiProperty({ description: 'Barcode or authentication code', example: 'ABCD1234567890' })
    @IsString()
    barcodeOrAuthCode: string;

    // Fields specific to electronic invoices
    @ApiProperty({ description: 'NFe access key', example: '35191012345678000191550010000012341999999999' })
    @IsOptional()
    @IsString()
    nfeAccessKey?: string;

    @ApiProperty({ description: 'NFe number', example: '98765' })
    @IsOptional()
    @IsString()
    nfeNumber?: string;

    @ApiProperty({ description: 'NFe authentication code', example: 'AUTH123456789' })
    @IsOptional()
    @IsString()
    nfeAuthCode?: string;

    @ApiProperty({ description: 'NFe authentication date and time', example: '2024-11-26T15:00:00Z' })
    @IsOptional()
    @IsDateString()
    nfeAuthDateTime?: string;
}
