import { ApiProperty } from '@nestjs/swagger';

export class ReceiptDto {
    @ApiProperty({ description: 'Unique identifier of the receipt', example: 'uuid-v4-id' })
    id: string;

    @ApiProperty({ description: 'Invoice number of the receipt', example: '123456' })
    invoiceNumber: string;

    @ApiProperty({ description: 'Invoice series of the receipt', example: 'A1' })
    invoiceSeries: string;

    @ApiProperty({ description: 'The date and time when the invoice was issued', example: '2024-11-27T12:00:00' })
    issueDateTime: string;

    @ApiProperty({ description: 'CNPJ of the firm issuing the receipt', example: '12345678000195' })
    issuerCnpj: string;

    @ApiProperty({ description: 'CNPJ of the recipient firm', example: '98765432000176' })
    recipientCnpj: string;

    @ApiProperty({ description: 'Total value of the receipt', example: 1500.50 })
    totalValue: number;

    @ApiProperty({ description: 'Base calculation value for ICMS', example: 1000.00 })
    icmsBase: number;

    @ApiProperty({ description: 'Value of ICMS', example: 150.00 })
    icmsValue: number;

    @ApiProperty({ description: 'Value of IPI', example: 50.00 })
    ipiValue: number;

    @ApiProperty({ description: 'Value of ISS', example: 100.00 })
    issValue: number;

    @ApiProperty({ description: 'ICMS rate percentage', example: 18.00 })
    icmsRate: number;

    @ApiProperty({ description: 'IPI rate percentage', example: 10.00 })
    ipiRate: number;

    @ApiProperty({ description: 'ISS rate percentage', example: 5.00 })
    issRate: number;

    @ApiProperty({ description: 'Barcode or authorization code for the invoice', example: '12345678901234567890' })
    barcodeOrAuthCode: string;

    @ApiProperty({ description: 'Access key for NFe (Nota Fiscal Eletrônica)', example: '351904123456789012345500100100001234567890123', required: false })
    nfeAccessKey?: string;
}
