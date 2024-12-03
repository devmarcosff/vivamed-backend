import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStockMovementDto {
    @ApiProperty({ description: 'ID do estoque do produto', example: 'uuid' })
    @IsString()
    @IsNotEmpty()
    stockProductId: string;

    @ApiProperty({ description: 'Tipo de movimentação', example: 'IN' })
    @IsEnum(['IN', 'OUT', 'ADJUSTMENT'])
    @IsNotEmpty()
    type: 'IN' | 'OUT' | 'ADJUSTMENT';

    @ApiProperty({ description: 'Quantidade movimentada', example: 10.5 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'Descrição da movimentação', example: 'Ajuste de inventário' })
    @IsString()
    @IsOptional()
    description?: string;
}
