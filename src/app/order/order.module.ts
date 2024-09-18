import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { Product } from '../product/entities/product.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  // Conexão com o repository do TypeORM
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product, Stock])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
