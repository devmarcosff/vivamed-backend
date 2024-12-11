import { Injectable } from '@nestjs/common';
import { CreateOrderV2Dto } from './dto/create-order-v2.dto';
import { UpdateOrderV2Dto } from './dto/update-order-v2.dto';

@Injectable()
export class OrderV2Service {
  create(createOrderV2Dto: CreateOrderV2Dto) {
    return 'This action adds a new orderV2';
  }

  findAll() {
    return `This action returns all orderV2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderV2`;
  }

  update(id: number, updateOrderV2Dto: UpdateOrderV2Dto) {
    return `This action updates a #${id} orderV2`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderV2`;
  }
}
