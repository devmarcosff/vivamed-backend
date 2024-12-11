import { PartialType } from '@nestjs/swagger';
import { CreateOrderV2Dto } from './create-order-v2.dto';

export class UpdateOrderV2Dto extends PartialType(CreateOrderV2Dto) {}
