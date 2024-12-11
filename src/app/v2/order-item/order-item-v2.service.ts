import { Injectable } from '@nestjs/common';
import { CreateOrderItemV2Dto } from './dto/create-order-item-v2.dto';
import { UpdateOrderItemV2Dto } from './dto/update-order-item-v2.dto';

@Injectable()
export class OrderItemV2Service {
  create(createOrderItemV2Dto: CreateOrderItemV2Dto) {
    return 'This action adds a new orderItemV2';
  }

  findAll() {
    return `This action returns all orderItemV2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderItemV2`;
  }

  update(id: number, updateOrderItemV2Dto: UpdateOrderItemV2Dto) {
    return `This action updates a #${id} orderItemV2`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderItemV2`;
  }
}
