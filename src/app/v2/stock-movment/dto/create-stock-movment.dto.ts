import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStockMovementDto {
    @ApiProperty({ description: 'Stock product ID', example: 'uuid' })
    @IsString()
    @IsNotEmpty()
    stockProductId: string;

    @ApiProperty({ description: 'Movement type', example: 'IN' })
    @IsEnum(['IN', 'OUT', 'ADJUSTMENT'])
    @IsNotEmpty()
    type: 'IN' | 'OUT' | 'ADJUSTMENT';

    @ApiProperty({ description: 'Quantity moved', example: 10.5 })
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ description: 'Movement description', example: 'Inventory adjustment' })
    @IsString()
    @IsOptional()
    description?: string;
}
