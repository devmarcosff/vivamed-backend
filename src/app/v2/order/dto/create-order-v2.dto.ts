import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateOrderItemV2Dto } from '../../order-item/dto/create-order-item-v2.dto';

export class CreateOrderV2Dto {
    @ApiProperty({ description: 'Details of the associated firm' })
    firmId: string;

    @ApiProperty({ description: 'Order items', type: () => [CreateOrderItemV2Dto], })
    @IsArray()
    @ValidateNested({ each: true })
    items: CreateOrderItemV2Dto[];
}