import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus, PaymentStatus } from 'src/shared/constants/order.constants';
import { PaginationParamsDto } from 'src/shared/dto/pagination-params.dto';

export class OrderV2FilterDto extends PaginationParamsDto {
    @ApiPropertyOptional({ description: 'Order number', example: 1 })
    @IsOptional()
    @IsString()
    number?: string;

    @ApiPropertyOptional({ description: 'Order status', enum: OrderStatus })
    @IsOptional()
    @IsEnum(OrderStatus)
    status?: OrderStatus;

    @ApiPropertyOptional({ description: 'Payment status', enum: PaymentStatus })
    @IsOptional()
    @IsEnum(PaymentStatus)
    paymentStatus?: PaymentStatus;
}