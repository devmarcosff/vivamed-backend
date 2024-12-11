import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderV2 } from './entities/order-v2.entity';
import { OrderV2Controller } from './order-v2.controller';
import { OrderV2Service } from './order-v2.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderV2])],
    controllers: [OrderV2Controller],
    providers: [OrderV2Service],
})
export class OrderV2Module { }
