import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from 'src/shared/constants/order.constants';
import { CreateOrderV2Dto } from './create-order-v2.dto';

export class UpdateOrderV2Dto extends PartialType(CreateOrderV2Dto) {
    @ApiPropertyOptional({ description: 'Order status', example: OrderStatus.INIT, enum: OrderStatus, required: false })
    status?: OrderStatus;

    @ApiPropertyOptional({ description: 'Payment status', example: PaymentStatus.PENDING, enum: PaymentStatus, required: false })
    paymentStatus?: PaymentStatus;
}
