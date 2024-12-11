import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemV2Dto } from './create-order-item-v2.dto';

export class UpdateOrderItemV2Dto extends PartialType(CreateOrderItemV2Dto) {}
