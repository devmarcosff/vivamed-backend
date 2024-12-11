import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateOrderItemV2Dto {
    @ApiProperty({ description: 'Order ID', example: 'uuid' })
    @IsNotEmpty()
    @IsString()
    orderId: string;

    @ApiProperty({ description: 'Stock Product ID', example: 'uuid' })
    @IsNotEmpty()
    @IsString()
    stockProductId: string;

    @ApiProperty({ description: 'Quantity of the product', example: 5 })
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    quantity: number;
}