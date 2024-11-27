import { IsDecimal, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class CreateReceiptProductDto {
    @IsString()
    @IsNotEmpty()
    receiptId: string;

    @IsString()
    @IsNotEmpty()
    productCode: string; // Código do produto

    @IsString()
    @IsNotEmpty()
    description: string; // Descrição do produto

    @IsString()
    @IsNotEmpty()
    ncmCode: string; // Código NCM/SH

    @IsString()
    @IsNotEmpty()
    cst: string; // CST

    @IsString()
    @IsNotEmpty()
    cfopCode: string; // Código CFOP

    @IsString()
    @IsNotEmpty()
    unitOfMeasure: string; // Unidade de medida

    @IsDecimal()
    @IsPositive()
    quantity: number; // Quantidade do produto

    @IsDecimal()
    @IsPositive()
    unitValue: number; // Valor unitário do produto

    @IsDecimal()
    @IsPositive()
    totalValue: number; // Valor total do produto (calculado: quantidade x valor unitário)

    @IsOptional()
    @IsDecimal()
    bcIcms?: number; // Base de cálculo ICMS

    @IsOptional()
    @IsDecimal()
    vIcms?: number; // Valor ICMS

    @IsOptional()
    @IsDecimal()
    vIpi?: number; // Valor IPI

    @IsOptional()
    @IsDecimal()
    aIcms?: number; // Alíquota ICMS

    @IsOptional()
    @IsDecimal()
    aIpi?: number; // Alíquota IPI
}
