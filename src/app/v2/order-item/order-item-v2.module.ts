import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemV2 } from './entities/order-item-v2.entity';
import { OrderItemV2Controller } from './order-item-v2.controller';
import { OrderItemV2Service } from './order-item-v2.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderItemV2])],
    controllers: [OrderItemV2Controller],
    providers: [OrderItemV2Service],
})
export class OrderItemV2Module { }
