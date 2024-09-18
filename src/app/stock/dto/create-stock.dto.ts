import { IsNumber, IsString } from "class-validator";

export class CreateStockDto {
    @IsNumber()
    quantity: number

    @IsString()
    productId: string
}
