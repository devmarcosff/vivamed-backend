import { PartialType } from '@nestjs/swagger';
import { IsDateString, IsDecimal, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateReceiptDto } from './create-receipt.dto';

export class UpdateReceiptDto extends PartialType(CreateReceiptDto) {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    receiptNumber?: string; // Número da nota fiscal

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    receiptSeries?: string; // Série da nota fiscal

    @IsOptional()
    @IsDateString()
    emissionDate?: Date; // Data e hora da emissão

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cnpjIssuer?: string; // CNPJ do emitente

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    cnpjRecipient?: string; // CNPJ do destinatário

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    totalValue?: number; // Valor total da nota fiscal

    // Informações de impostos
    @IsOptional()
    @IsDecimal()
    @IsPositive()
    icmsBase?: number; // Base de cálculo ICMS

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    icmsValue?: number; // Valor ICMS

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    ipiValue?: number; // Valor IPI

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    issValue?: number; // Valor ISS

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    icmsRate?: number; // Alíquota ICMS

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    ipiRate?: number; // Alíquota IPI

    @IsOptional()
    @IsDecimal()
    @IsPositive()
    issRate?: number; // Alíquota ISS
}
