import { ApiProperty } from "@nestjs/swagger";
import { OrderV2Dto } from "../../order/dto/order-v2.dto";
import { StockProductV2Dto } from "../../stock-product/dto/stock-product.dto";

export class OrderItemV2Dto {
    @ApiProperty({ description: 'ID of the order item', example: 'uuid' })
    id: string;

    @ApiProperty({ description: 'Quantity of the product', example: 5 })
    quantity: number;

    @ApiProperty({ description: 'Price of the item', example: 10.50 })
    price: number;

    @ApiProperty({ description: 'Order', type: () => OrderV2Dto })
    order: OrderV2Dto

    @ApiProperty({ description: 'Stock Product details', type: () => StockProductV2Dto })
    stockProduct: StockProductV2Dto;
}