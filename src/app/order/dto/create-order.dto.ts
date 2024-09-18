import { IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsNumber()
    quantity?: number

    @IsString()
    productId?: string
}
