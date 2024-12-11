import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentStatus } from 'src/shared/constants/order.constants';
import { FirmDto } from '../../firm/dto/firm.dto';
import { OrderItemV2Dto } from '../../order-item/dto/order-item-v2.dto';
import { UserV2Dto } from '../../user/dto/user-v2.dto';

export class OrderV2Dto {
    @ApiProperty({ description: 'ID of the order', example: 'uuid' })
    id: string;

    @ApiProperty({ description: 'Order number', example: 1 })
    number: string;

    @ApiProperty({ description: 'Order status', enum: OrderStatus, example: OrderStatus.INIT })
    status: OrderStatus;

    @ApiProperty({ description: 'Payment status', enum: PaymentStatus, example: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @ApiProperty({ description: 'Total order value', example: 100.50 })
    total: number;

    @ApiProperty({ description: 'User', type: () => UserV2Dto, })
    user: UserV2Dto;

    @ApiProperty({ description: 'Firm', type: () => FirmDto, })
    recipientFirm: FirmDto;

    @ApiProperty({ description: 'Order items', type: () => [OrderItemV2Dto], })
    orderItens: OrderItemV2Dto[];
}