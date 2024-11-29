import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';

export class ReceiptFilterDto extends PaginationParamsDto {
    @ApiProperty({ description: 'Invoice number of the receipt', example: '123456', required: false })
    @IsOptional()
    @IsString()
    invoiceNumber?: string;

    @ApiProperty({ description: 'Invoice series of the receipt', example: 'A1', required: false })
    @IsOptional()
    @IsString()
    invoiceSeries?: string;

    @ApiProperty({ description: 'Issue date and time of the receipt', example: '2024-11-27T12:00:00', required: false })
    @IsOptional()
    @IsDateString()
    issueDateTime?: string;

    @ApiProperty({ description: 'CNPJ of the issuer firm', example: '12345678000195', required: false })
    @IsOptional()
    @IsString()
    issuerCnpj?: string;
}
